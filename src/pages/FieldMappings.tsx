import { useState } from "react";
import {
  Database,
  Plus,
  Trash2,
  Edit,
  MoreVertical,
  Search,
  Save,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface FieldMapping {
  id: string;
  standardField: string;
  sourceFields: string[];
  description: string;
  category: string;
}

const mockMappings: FieldMapping[] = [
  {
    id: "1",
    standardField: "action",
    sourceFields: ["Action", "act", "Operation", "EventType", "activity"],
    description: "The type of action performed",
    category: "Core",
  },
  {
    id: "2",
    standardField: "user",
    sourceFields: ["User", "username", "SubjectUserName", "Actor", "principal"],
    description: "The user who performed the action",
    category: "Core",
  },
  {
    id: "3",
    standardField: "machine",
    sourceFields: ["Computer", "hostname", "WorkstationName", "device", "src_host"],
    description: "The machine where the event occurred",
    category: "Core",
  },
  {
    id: "4",
    standardField: "timestamp",
    sourceFields: ["TimeGenerated", "@timestamp", "EventTime", "datetime", "created_at"],
    description: "When the event occurred",
    category: "Core",
  },
  {
    id: "5",
    standardField: "target",
    sourceFields: ["TargetUserName", "Object", "destination", "target_user"],
    description: "The target of the action",
    category: "Extended",
  },
  {
    id: "6",
    standardField: "result",
    sourceFields: ["Status", "Result", "outcome", "success"],
    description: "The result of the action",
    category: "Extended",
  },
  {
    id: "7",
    standardField: "source_ip",
    sourceFields: ["IpAddress", "src_ip", "SourceAddress", "client_ip"],
    description: "Source IP address",
    category: "Network",
  },
  {
    id: "8",
    standardField: "file_path",
    sourceFields: ["ObjectName", "FilePath", "path", "file"],
    description: "File or folder path",
    category: "File",
  },
];

const categories = ["All", "Core", "Extended", "Network", "File"];

export default function FieldMappings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mappings, setMappings] = useState<FieldMapping[]>(mockMappings);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<FieldMapping | null>(null);
  const [newSourceField, setNewSourceField] = useState("");

  const filteredMappings = mappings.filter((m) => {
    const matchesSearch =
      m.standardField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sourceFields.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEditMapping = (mapping: FieldMapping) => {
    setSelectedMapping({ ...mapping });
    setEditDialogOpen(true);
  };

  const handleAddSourceField = () => {
    if (selectedMapping && newSourceField.trim()) {
      setSelectedMapping({
        ...selectedMapping,
        sourceFields: [...selectedMapping.sourceFields, newSourceField.trim()],
      });
      setNewSourceField("");
    }
  };

  const handleRemoveSourceField = (field: string) => {
    if (selectedMapping) {
      setSelectedMapping({
        ...selectedMapping,
        sourceFields: selectedMapping.sourceFields.filter((f) => f !== field),
      });
    }
  };

  const handleSaveMapping = () => {
    if (selectedMapping) {
      setMappings(
        mappings.map((m) => (m.id === selectedMapping.id ? selectedMapping : m))
      );
      setEditDialogOpen(false);
      setSelectedMapping(null);
      toast({
        title: "Mapping Updated",
        description: "Field mapping has been saved successfully.",
      });
    }
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter((m) => m.id !== id));
    toast({
      title: "Mapping Deleted",
      description: "The field mapping has been removed.",
    });
  };

  return (
    <>
      <Header
        title="Field Mappings"
        subtitle="Normalize log fields from different sources to standard fields"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Info Banner */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Smart Mapping Engine</h3>
              <p className="text-sm text-muted-foreground">
                Different log sources use different field names for the same data. Define mappings here to normalize 
                fields like "Action", "act", and "Operation" to a single standard field. This enables consistent 
                searching across all data sources.
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mappings..."
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Mapping
            </Button>
          </div>

          {/* Mappings List */}
          <div className="space-y-4">
            {filteredMappings.map((mapping) => (
              <div
                key={mapping.id}
                className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground font-mono">
                        {mapping.standardField}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {mapping.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {mapping.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Maps from:</span>
                      {mapping.sourceFields.map((field) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          {field}
                        </Badge>
                      ))}
                      <ArrowRight className="w-4 h-4 text-primary mx-2" />
                      <Badge className="bg-primary/20 text-primary font-mono text-xs">
                        {mapping.standardField}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMapping(mapping)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Mapping
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteMapping(mapping.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Mapping Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Field Mapping</DialogTitle>
            <DialogDescription>
              Add or remove source fields that map to this standard field.
            </DialogDescription>
          </DialogHeader>
          {selectedMapping && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Standard Field</Label>
                <Input value={selectedMapping.standardField} disabled className="font-mono" />
              </div>

              <div className="space-y-2">
                <Label>Source Fields</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg min-h-[60px]">
                  {selectedMapping.sourceFields.map((field) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className="font-mono text-sm cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleRemoveSourceField(field)}
                    >
                      {field}
                      <span className="ml-1 text-muted-foreground">×</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Source Field</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSourceField}
                    onChange={(e) => setNewSourceField(e.target.value)}
                    placeholder="e.g., EventAction"
                    className="font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSourceField()}
                  />
                  <Button onClick={handleAddSourceField}>Add</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMapping}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
