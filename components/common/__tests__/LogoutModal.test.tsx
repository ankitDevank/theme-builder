import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutModal from "../LogoutModal";
import { signOut } from "next-auth/react";
import { PATH } from "@/lib/path";

jest.mock("next-auth/react", () => ({
    signOut: jest.fn(),
}));

jest.mock("framer-motion", () => {
    const ProxyComponent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
    return {
        motion: {
            div: ProxyComponent,
            span: ProxyComponent,
        },
    };
});

describe("LogoutModal", () => {
    const mockSetIsLogoutDialogOpen = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly when open", () => {
        render(
            <LogoutModal
                isLogoutDialogOpen={true}
                setIsLogoutDialogOpen={mockSetIsLogoutDialogOpen}
            />
        );

        expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Are you sure you want to logout? You will need to login again to access your account."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("does not render when closed", () => {
        render(
            <LogoutModal
                isLogoutDialogOpen={false}
                setIsLogoutDialogOpen={mockSetIsLogoutDialogOpen}
            />
        );

        expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
    });

    it("calls setIsLogoutDialogOpen(false) when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <LogoutModal
                isLogoutDialogOpen={true}
                setIsLogoutDialogOpen={mockSetIsLogoutDialogOpen}
            />
        );

        await user.click(screen.getByRole("button", { name: /cancel/i }));

        expect(mockSetIsLogoutDialogOpen).toHaveBeenCalledWith(false);
    });

    it("calls signOut when logout button is clicked", async () => {
        const user = userEvent.setup();
        (signOut as jest.Mock).mockResolvedValue(undefined);

        render(
            <LogoutModal
                isLogoutDialogOpen={true}
                setIsLogoutDialogOpen={mockSetIsLogoutDialogOpen}
            />
        );

        await user.click(screen.getByRole("button", { name: /logout/i }));

        expect(signOut).toHaveBeenCalledWith({ callbackUrl: PATH.LOGIN });
    });

    it("shows loading state when logging out", async () => {
        const user = userEvent.setup();
        let resolveSignOut: (value: unknown) => void;
        (signOut as jest.Mock).mockImplementation(() => {
            return new Promise((resolve) => {
                resolveSignOut = resolve;
            });
        });

        render(
            <LogoutModal
                isLogoutDialogOpen={true}
                setIsLogoutDialogOpen={mockSetIsLogoutDialogOpen}
            />
        );

        await user.click(screen.getByRole("button", { name: /logout/i }));

        expect(screen.getByText("Logging out...")).toBeInTheDocument();
        expect(screen.queryByText("Logout")).not.toBeInTheDocument();

        if (resolveSignOut!) resolveSignOut(undefined);
    });
});
