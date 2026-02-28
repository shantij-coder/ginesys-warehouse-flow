import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/wms/AppHeader";
import SubHeader from "@/components/wms/SubHeader";
import LOVPopup, { type LOVItem } from "@/components/wms/LOVPopup";
import DiscardDialog from "@/components/wms/DiscardDialog";
import { ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

interface SettingField {
  id: string;
  section: string;
  label: string;
  value: LOVItem | null;
  items: LOVItem[];
  allowNull: boolean;
}

const initialSettings: SettingField[] = [
  {
    id: "site",
    section: "Site Settings",
    label: "Site Code",
    value: { id: "24", label: "24 [Default]", subLabel: "Mumbai Warehouse" },
    items: [
      { id: "24", label: "24 [Default]", subLabel: "Mumbai Warehouse" },
      { id: "31", label: "31", subLabel: "Delhi DC" },
      { id: "42", label: "42", subLabel: "Kolkata Hub" },
    ],
    allowNull: true,
  },
  {
    id: "pa_stockpoint",
    section: "Put Away",
    label: "Stock Point",
    value: null,
    items: [
      { id: "1742", label: "South WH [1742]" },
      { id: "1801", label: "North WH [1801]" },
      { id: "2100", label: "East Wing [2100]" },
    ],
    allowNull: true,
  },
  {
    id: "pa_docscheme",
    section: "Put Away",
    label: "Doc Scheme",
    value: null,
    items: [
      { id: "DS01", label: "PA-Default [DS01]" },
      { id: "DS02", label: "PA-Express [DS02]" },
    ],
    allowNull: true,
  },
  {
    id: "pa_mode",
    section: "Put Away",
    label: "Mode",
    value: { id: "manual", label: "MANUAL" },
    items: [{ id: "manual", label: "MANUAL" }],
    allowNull: false,
  },
  {
    id: "ta_stockpoint",
    section: "Take Away",
    label: "Stock Point",
    value: null,
    items: [
      { id: "1742", label: "South WH [1742]" },
      { id: "1801", label: "North WH [1801]" },
    ],
    allowNull: true,
  },
  {
    id: "ta_docscheme",
    section: "Take Away",
    label: "Doc Scheme",
    value: null,
    items: [
      { id: "TA01", label: "TA-Default [TA01]" },
      { id: "TA02", label: "TA-Express [TA02]" },
    ],
    allowNull: true,
  },
  {
    id: "ta_mode",
    section: "Take Away",
    label: "Mode",
    value: { id: "both", label: "BOTH" },
    items: [
      { id: "manual", label: "MANUAL" },
      { id: "suggestive", label: "SUGGESTIVE" },
      { id: "both", label: "BOTH" },
    ],
    allowNull: false,
  },
  {
    id: "pl_savemode",
    section: "Pick List",
    label: "Save Mode",
    value: { id: "manual", label: "MANUAL" },
    items: [
      { id: "auto", label: "AUTO" },
      { id: "manual", label: "MANUAL" },
    ],
    allowNull: false,
  },
  {
    id: "pl_showimage",
    section: "Pick List",
    label: "Show Item Image",
    value: { id: "yes", label: "YES" },
    items: [
      { id: "yes", label: "YES" },
      { id: "no", label: "NO" },
    ],
    allowNull: false,
  },
];

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingField[]>(initialSettings);
  const [activeLOV, setActiveLOV] = useState<string | null>(null);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const activeField = settings.find((s) => s.id === activeLOV);

  const handleSelect = (fieldId: string, item: LOVItem | null) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === fieldId ? { ...s, value: item } : s))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!hasChanges) {
      toast("No changes to save.");
      return;
    }
    toast.success("Settings saved successfully.");
    setHasChanges(false);
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowUnsaved(true);
    } else {
      navigate("/dashboard");
    }
  };

  const sections = settings.reduce<Record<string, SettingField[]>>((acc, s) => {
    if (!acc[s.section]) acc[s.section] = [];
    acc[s.section].push(s);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title="Settings" showHome onBack={handleBack} />
      <SubHeader />

      <div className="flex-1 overflow-y-auto">
        {Object.entries(sections).map(([section, fields]) => (
          <div key={section}>
            <div className="bg-muted/50 px-4 py-2.5">
              <h2 className="text-badge font-bold text-primary uppercase tracking-wider">{section}</h2>
            </div>
            {fields.map((field) => (
              <button
                key={field.id}
                onClick={() => setActiveLOV(field.id)}
                className="flex w-full items-center justify-between border-b px-4 py-4 text-left hover:bg-primary/3 transition-colors min-h-[56px]"
              >
                <div>
                  <p className="text-badge text-muted-foreground uppercase tracking-wide">{field.label}</p>
                  <p className="text-card-name text-card-foreground mt-0.5">
                    {field.value?.label || (
                      <span className="italic text-muted-foreground/60">Select {field.label}</span>
                    )}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              </button>
            ))}
          </div>
        ))}

        <div>
          <div className="bg-muted/50 px-4 py-2.5">
            <h2 className="text-badge font-bold text-primary uppercase tracking-wider">Other</h2>
          </div>
          <div className="flex items-center justify-between border-b px-4 py-4 min-h-[56px]">
            <div>
              <p className="text-badge text-muted-foreground uppercase tracking-wide">Posting</p>
              <p className="text-card-name text-card-foreground mt-0.5">Suspense</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-muted/50 px-4 py-2.5">
            <h2 className="text-badge font-bold text-primary uppercase tracking-wider">Profile</h2>
          </div>
          <button
            onClick={() => toast.info("Profile settings can be accessed from the Settings menu.")}
            className="flex w-full items-center justify-between border-b px-4 py-4 hover:bg-primary/3 transition-colors min-h-[56px]"
          >
            <p className="text-card-name text-card-foreground">View Profile</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-card/90 backdrop-blur-sm p-4">
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-section font-semibold text-primary-foreground shadow-card active:bg-primary-dark transition-all min-h-[56px]"
        >
          <Save className="h-5 w-5" />
          SAVE CHANGES
        </button>
      </div>

      {activeField && (
        <LOVPopup
          open={!!activeLOV}
          title={`Select ${activeField.label}`}
          items={activeField.items}
          selectedId={activeField.value?.id}
          allowNull={activeField.allowNull}
          onSelect={(item) => handleSelect(activeField.id, item)}
          onClose={() => setActiveLOV(null)}
        />
      )}

      <DiscardDialog
        open={showUnsaved}
        message="Unsaved changes will be lost. Do you want to go back?"
        cancelLabel="NO"
        confirmLabel="YES"
        onCancel={() => setShowUnsaved(false)}
        onConfirm={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default Settings;
