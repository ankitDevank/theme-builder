import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PATH } from "@/lib/path";

jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("sonner");

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  it("renders the login form correctly", () => {
    render(<LoginPage />);
    
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("calls signIn with correct credentials on valid submission", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("shows success toast and redirects on successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Login successful 🎉");
      expect(mockPush).toHaveBeenCalledWith(PATH.ROOT);
    });
  });

  it("shows error toast on invalid credentials", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
