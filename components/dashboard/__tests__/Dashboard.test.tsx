import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../Dashboard";
import { getBuilderForUser, saveBuilderForUser } from "@/app/actions/builder";
import { toast } from "sonner";

jest.mock("@/app/actions/builder", () => ({
    getBuilderForUser: jest.fn(),
    saveBuilderForUser: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("@dnd-kit/core", () => ({
    ...jest.requireActual("@dnd-kit/core"),
    DndContext: ({ children }: any) => <div>{children}</div>,
    useSensitive: jest.fn(),
    useSensors: jest.fn(),
}));

jest.mock("../Sidebar", () => {
    return function MockSidebar({ setCardsPerRow, cardsPerRow }: any) {
        return (
            <div data-testid="sidebar">
                {cardsPerRow} Cols
                <button onClick={() => setCardsPerRow(2)}>Set 2 Cols</button>
            </div>
        );
    };
});

jest.mock("next/dynamic", () => () => {
    const MockCanvas = ({ sections }: any) => (
        <div data-testid="canvas">
            Canvas with {sections.length} sections
        </div>
    );
    return MockCanvas;
});

const mockUsers = [
    { id: "user1", name: "User One" },
    { id: "user2", name: "User Two" },
];

const mockInitialConfig = {
    sections: [],
    layout: { cardsPerRow: 3 },
};

describe("Dashboard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders Sidebar and Canvas for Editor", () => {
        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="EDITOR"
            />
        );

        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByTestId("canvas")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save page/i })).toBeInTheDocument();
    });

    it("renders Sidebar and Canvas for Admin", () => {
        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="ADMIN"
            />
        );

        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByTestId("canvas")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save page/i })).toBeInTheDocument();
    });

    it("does not render Sidebar or Save button for Viewer", () => {
        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="VIEWER"
            />
        );

        expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
        expect(screen.getByTestId("canvas")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /save page/i })).not.toBeInTheDocument();
    });

    it("fetches user config when switching user", async () => {
        const user = userEvent.setup();
        (getBuilderForUser as jest.Mock).mockResolvedValue({
            sections: [{ id: "s1", type: "hero", heading: "New Hero", subheading: "Sub" }],
            layout: { cardsPerRow: 3 },
        });

        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="ADMIN"
            />
        );

        expect(screen.getByText("User One")).toBeInTheDocument();

        const trigger = screen.getByRole("combobox");
        await user.click(trigger);

        const user2Option = await screen.findByText("User Two");
        await user.click(user2Option);

        await waitFor(() => {
            expect(getBuilderForUser).toHaveBeenCalledWith("user2");
        });
    });

    it("saves config when save button is clicked", async () => {
        const user = userEvent.setup();

        let resolveSave: (value: any) => void;
        const savePromise = new Promise((resolve) => {
            resolveSave = resolve;
        });
        (saveBuilderForUser as jest.Mock).mockReturnValue(savePromise);

        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="ADMIN"
            />
        );

        const saveBtn = screen.getByRole("button", { name: /save page/i });
        await user.click(saveBtn);

        expect(screen.getByText(/saving page/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /saving page/i })).toBeDisabled();

        await act(async () => {
            resolveSave!(true);
        });

        await waitFor(() => {
            expect(saveBuilderForUser).toHaveBeenCalledWith(
                "user1",
                expect.objectContaining({
                    layout: { cardsPerRow: 3 },
                    sections: []
                })
            );
            expect(toast.success).toHaveBeenCalledWith("Page saved successfully");
            expect(screen.getByRole("button", { name: /save page/i })).not.toBeDisabled();
        });
    });

    it("shows error if save fails", async () => {
        const user = userEvent.setup();
        (saveBuilderForUser as jest.Mock).mockRejectedValue(new Error("Fail"));

        render(
            <Dashboard
                users={mockUsers}
                initialUserId="user1"
                initialConfig={mockInitialConfig}
                currentUserRole="ADMIN"
            />
        );

        const saveBtn = screen.getByRole("button", { name: /save page/i });
        await user.click(saveBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to save page");
        });
    });
});
