import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Building2, Mail, Phone, Globe, Loader2 } from "lucide-react";
import { getSetting, setSetting } from "@/lib/api";

export default function GeneralSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    enableNotifications: true,
    maintenanceMode: false,
  });

  // Fetch settings from backend
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const [companyName, contactEmail, contactPhone, address, enableNotifications, maintenanceMode] =
        await Promise.all([
          getSetting("companyName").catch(() => "Yetosol"),
          getSetting("contactEmail").catch(() => "info@yetosol.com"),
          getSetting("contactPhone").catch(() => "+234 703 917 1254"),
          getSetting("address").catch(() => "2nd Floor, 24/28 Strachan Street, Lagos Island, Nigeria"),
          getSetting("enableNotifications").catch(() => true),
          getSetting("maintenanceMode").catch(() => false),
        ]);
      return { companyName, contactEmail, contactPhone, address, enableNotifications, maintenanceMode };
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await Promise.all([
        setSetting("companyName", data.companyName),
        setSetting("contactEmail", data.contactEmail),
        setSetting("contactPhone", data.contactPhone),
        setSetting("address", data.address),
        setSetting("enableNotifications", data.enableNotifications),
        setSetting("maintenanceMode", data.maintenanceMode),
      ]);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">General Settings</h2>
        <p className="text-sm text-gray-500">Manage your company profile and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Email Notifications</p>
              <p className="text-sm text-gray-500">Send notifications for important events</p>
            </div>
            <Switch
              checked={formData.enableNotifications}
              onCheckedChange={(val) => handleSwitchChange("enableNotifications", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable the application for non-admin users</p>
            </div>
            <Switch
              checked={formData.maintenanceMode}
              onCheckedChange={(val) => handleSwitchChange("maintenanceMode", val)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}