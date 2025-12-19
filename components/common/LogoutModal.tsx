import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const LogoutModal = ({
  isLogoutDialogOpen,
  setIsLogoutDialogOpen,
}: {
  isLogoutDialogOpen: boolean;
  setIsLogoutDialogOpen: (open: boolean) => void;
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <DialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => {
          if (isLoggingOut) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (isLoggingOut) {
            e.preventDefault();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2 inline-block"
                  >
                    ⏳
                  </motion.span>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
