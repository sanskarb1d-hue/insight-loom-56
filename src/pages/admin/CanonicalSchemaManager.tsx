import { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Database, Search, 
  Save, X, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CanonicalField {
  id: string;
  field_name: string;
  data_type: 'string' | 'number' | 'boolean' | 'datetime' | 'array' | 'object';
  description: string;
  category: string;
  required: boolean;
  created_at: string;
}

// Mock canonical fields
const initialFields: CanonicalField[] = [
  { 
    id: 'cf-001', 
    field_name: 'event_time', 
    data_type: 'datetime', 
    description: 'Timestamp when the event occurred',
    category: 'Core',
    required: true,
    created_at: '2024-01-10'
  },
  { 
    id: 'cf-002', 
    field_name: 'actor_user', 
    data_type: 'string', 
    description: 'User who performed the action',
    category: 'Identity',
    required: true,
    created_at: '2024-01-10'
  },
  { 
    id: 'cf-003', 
    field_name: 'action_type', 
    data_type: 'string', 
    description: 'Type of action performed (create, update, delete, login, etc.)',
    category: 'Core',
    required: true,
    created_at: '2024-01-10'
  },
  { 
    id: 'cf-004', 
    field_name: 'object_target', 
    data_type: 'string', 
    description: 'The object or resource being acted upon',
    category: 'Core',
    required: false,
    created_at: '2024-01-10'
  },
  { 
    id: 'cf-005', 
    field_name: 'source_ip', 
    data_type: 'string', 
    description: 'IP address of the source machine',
    category: 'Network',
    required: false,
    created_at: '2024-01-12'
  },
  { 
    id: 'cf-006', 
    field_name: 'machine_name', 
    data_type: 'string', 
    description: 'Hostname of the machine generating the log',
    category: 'System',
    required: true,
    created_at: '2024-01-12'
  },
  { 
    id: 'cf-007', 
    field_name: 'severity', 
    data_type: 'string', 
    description: 'Severity level (info, warning, error, critical)',
    category: 'Core',
    required: true,
    created_at: '2024-01-12'
  },
  { 
    id: 'cf-008', 
    field_name: 'result_status', 
    data_type: 'string', 
    description: 'Outcome of the action (success, failure, partial)',
    category: 'Core',
    required: false,
    created_at: '2024-01-15'
  },
];

const dataTypes = ['string', 'number', 'boolean', 'datetime', 'array', 'object'];
const categories = ['Core', 'Identity', 'Network', 'System', 'Security', 'Custom'];

const CanonicalSchemaManager = () => {
  const [fields, setFields] = useState<CanonicalField[]>(initialFields);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CanonicalField | null>(null);
  const [formData, setFormData] = useState({
    field_name: '',
    data_type: 'string' as CanonicalField['data_type'],
    description: '',
    category: 'Core',
    required: false,
  });
  const { toast } = useToast();

  const filteredFields = fields.filter(field =>
    field.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (field?: CanonicalField) => {
    if (field) {
      setEditingField(field);
      setFormData({
        field_name: field.field_name,
        data_type: field.data_type,
        description: field.description,
        category: field.category,
        required: field.required,
      });
    } else {
      setEditingField(null);
      setFormData({
        field_name: '',
        data_type: 'string',
        description: '',
        category: 'Core',
        required: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.field_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Field name is required',
        variant: 'destructive',
      });
      return;
    }

    if (editingField) {
      // Update existing field
      setFields(fields.map(f => 
        f.id === editingField.id 
          ? { ...f, ...formData }
          : f
      ));
      toast({
        title: 'Field Updated',
        description: `${formData.field_name} has been updated successfully.`,
      });
    } else {
      // Create new field
      const newField: CanonicalField = {
        id: `cf-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
      };
      setFields([...fields, newField]);
      toast({
        title: 'Field Created',
        description: `${formData.field_name} has been added to the schema.`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (field: CanonicalField) => {
    setFields(fields.filter(f => f.id !== field.id));
    toast({
      title: 'Field Deleted',
      description: `${field.field_name} has been removed from the schema.`,
    });
  };

  const getDataTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      string: 'bg-blue-50 text-blue-700 border-blue-200',
      number: 'bg-purple-50 text-purple-700 border-purple-200',
      boolean: 'bg-amber-50 text-amber-700 border-amber-200',
      datetime: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      array: 'bg-pink-50 text-pink-700 border-pink-200',
      object: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return <Badge variant="outline" className={colors[type] || colors.string}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Canonical Schema Manager</h1>
          <p className="text-slate-500">Define and manage the standard fields for log normalization</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-primary text-white">
          <Plus className="w-4 h-4" />
          Add New Field
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{fields.length}</p>
                <p className="text-xs text-slate-500">Total Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {fields.filter(f => f.required).length}
                </p>
                <p className="text-xs text-slate-500">Required Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(fields.map(f => f.category)).size}
                </p>
                <p className="text-xs text-slate-500">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Database className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(fields.map(f => f.data_type)).size}
                </p>
                <p className="text-xs text-slate-500">Data Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-slate-200">
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search fields by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fields Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Canonical Fields</CardTitle>
          <CardDescription>
            These fields form the standard schema that all log sources are mapped to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field) => (
                <TableRow key={field.id} className="hover:bg-slate-50">
                  <TableCell>
                    <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-sm font-mono">
                      {field.field_name}
                    </code>
                  </TableCell>
                  <TableCell>{getDataTypeBadge(field.data_type)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm text-slate-600 truncate">{field.description}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {field.required ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(field)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(field)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingField ? 'Edit Canonical Field' : 'Add New Canonical Field'}
            </DialogTitle>
            <DialogDescription>
              Define a standard field that source logs will be mapped to
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                placeholder="e.g., event_time, actor_user"
                value={formData.field_name}
                onChange={(e) => setFormData({ ...formData, field_name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
              />
              <p className="text-xs text-slate-500">Use snake_case naming convention</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Type *</Label>
                <Select 
                  value={formData.data_type} 
                  onValueChange={(value: CanonicalField['data_type']) => 
                    setFormData({ ...formData, data_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {dataTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this field represents..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="required" className="text-sm font-normal">
                This field is required for all log sources
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {editingField ? 'Update Field' : 'Create Field'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CanonicalSchemaManager;
