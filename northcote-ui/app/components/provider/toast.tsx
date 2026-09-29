import { Toaster } from "sonner";
import { useTheme } from "./theme.js";

const ToastProvider = () => {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
};

export default ToastProvider;
