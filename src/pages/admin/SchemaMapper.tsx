import { useState, useEffect } from 'react';
import { 
  ArrowRight, Save, RefreshCw, Search, CheckCircle, 
  AlertCircle, Info, Database, FileJson, Wand2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface CanonicalField {
  id: string;
  field_name: string;
  data_type: string;
  description: string;
  required: boolean;
}

interface LogCategory {
  id: string;
  name: string;
  description: string;
  sampleFields: string[];
}

interface FieldMapping {
  canonical_field: string;
  source_field: string;
}

// Mock canonical fields
const canonicalFields: CanonicalField[] = [
  { id: 'cf-001', field_name: 'event_time', data_type: 'datetime', description: 'Timestamp when the event occurred', required: true },
  { id: 'cf-002', field_name: 'actor_user', data_type: 'string', description: 'User who performed the action', required: true },
  { id: 'cf-003', field_name: 'action_type', data_type: 'string', description: 'Type of action performed', required: true },
  { id: 'cf-004', field_name: 'object_target', data_type: 'string', description: 'The object being acted upon', required: false },
  { id: 'cf-005', field_name: 'source_ip', data_type: 'string', description: 'IP address of the source', required: false },
  { id: 'cf-006', field_name: 'machine_name', data_type: 'string', description: 'Hostname of the machine', required: true },
  { id: 'cf-007', field_name: 'severity', data_type: 'string', description: 'Severity level', required: true },
  { id: 'cf-008', field_name: 'result_status', data_type: 'string', description: 'Outcome of the action', required: false },
  { id: 'cf-009', field_name: 'department', data_type: 'string', description: 'Department or organization unit', required: false },
  { id: 'cf-010', field_name: 'location', data_type: 'string', description: 'Physical or logical location', required: false },
];

// Mock log categories with sample source fields
const logCategories: LogCategory[] = [
  { 
    id: 'cat-001', 
    name: 'ad_state_snapshot', 
    description: 'Active Directory state and user information',
    sampleFields: ['WhenCreated', 'LoginName', 'DisplayName', 'Email', 'Department', 'Title', 'Manager', 'LastLogon', 'PasswordLastSet', 'Enabled']
  },
  { 
    id: 'cat-002', 
    name: 'windows_security_events', 
    description: 'Windows Security Event Logs',
    sampleFields: ['TimeGenerated', 'AccountName', 'EventID', 'TargetUserName', 'IpAddress', 'WorkstationName', 'LogonType', 'Status', 'SubjectUserName']
  },
  { 
    id: 'cat-003', 
    name: 'file_access_logs', 
    description: 'File and folder access audit logs',
    sampleFields: ['Timestamp', 'UserName', 'Operation', 'FilePath', 'ClientIP', 'ComputerName', 'AccessMask', 'Result', 'ProcessName']
  },
  { 
    id: 'cat-004', 
    name: 'software_inventory', 
    description: 'Installed software inventory data',
    sampleFields: ['CollectedAt', 'InstalledBy', 'Action', 'SoftwareName', 'Version', 'Publisher', 'InstallDate', 'MachineName', 'InstallLocation']
  },
  { 
    id: 'cat-005', 
    name: 'network_connections', 
    description: 'Network connection and traffic logs',
    sampleFields: ['EventTime', 'SourceUser', 'ConnectionType', 'DestinationIP', 'SourceIP', 'HostName', 'Protocol', 'Status', 'BytesSent', 'BytesReceived']
  },
];

// Mock existing mappings
const existingMappings: Record<string, FieldMapping[]> = {
  'ad_state_snapshot': [
    { canonical_field: 'event_time', source_field: 'WhenCreated' },
    { canonical_field: 'actor_user', source_field: 'LoginName' },
    { canonical_field: 'machine_name', source_field: '' },
  ],
};

const SchemaMapper = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const currentCategory = logCategories.find(c => c.name === selectedCategory);

  // Load existing mappings when category changes
  useEffect(() => {
    if (selectedCategory && existingMappings[selectedCategory]) {
      const loadedMappings: Record<string, string> = {};
      existingMappings[selectedCategory].forEach(m => {
        loadedMappings[m.canonical_field] = m.source_field;
      });
      setMappings(loadedMappings);
    } else {
      setMappings({});
    }
  }, [selectedCategory]);

  const handleMappingChange = (canonicalField: string, sourceField: string) => {
    setMappings(prev => ({
      ...prev,
      [canonicalField]: sourceField
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Build the mapping rules JSON
    const mappingRules = Object.entries(mappings)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Saving mappings:', {
      log_category: selectedCategory,
      mapping_rules: mappingRules
    });

    toast({
      title: 'Mappings Saved',
      description: `Successfully saved ${Object.keys(mappingRules).length} field mappings for ${selectedCategory}`,
    });

    setIsSaving(false);
  };

  const filteredCanonicalFields = canonicalFields.filter(field =>
    field.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMappingStatus = () => {
    const required = canonicalFields.filter(f => f.required);
    const mappedRequired = required.filter(f => mappings[f.field_name]?.trim());
    return {
      total: canonicalFields.length,
      mapped: Object.values(mappings).filter(v => v.trim()).length,
      requiredTotal: required.length,
      requiredMapped: mappedRequired.length,
    };
  };

  const status = getMappingStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schema Mapper</h1>
          <p className="text-slate-500">Map source log fields to canonical schema</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!selectedCategory || isSaving}
          className="gap-2 bg-primary text-white"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Mappings
            </>
          )}
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">How Schema Mapping Works</p>
              <p className="text-sm text-blue-700 mt-1">
                Select a log category on the left, then map each source field to its corresponding canonical field.
                This allows the platform to normalize logs from different sources into a consistent format for searching and analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Category Selection */}
        <Card className="border-slate-200 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Log Categories
            </CardTitle>
            <CardDescription>Select a log source to configure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {logCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedCategory === category.name
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{category.name}</p>
                  {existingMappings[category.name] && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                      Configured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{category.description}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {category.sampleFields.length} source fields available
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right Column - Field Mapping */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Field Mappings
                </CardTitle>
                <CardDescription>
                  {selectedCategory 
                    ? `Configure mappings for ${selectedCategory}`
                    : 'Select a log category to start mapping'
                  }
                </CardDescription>
              </div>
              {selectedCategory && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Mapped:</span>
                    <Badge variant="outline">{status.mapped}/{status.total}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Required:</span>
                    <Badge 
                      variant="outline" 
                      className={status.requiredMapped === status.requiredTotal 
                        ? 'text-emerald-600 border-emerald-200' 
                        : 'text-amber-600 border-amber-200'
                      }
                    >
                      {status.requiredMapped}/{status.requiredTotal}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedCategory ? (
              <div className="text-center py-12 text-slate-500">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Select a log category from the left panel to configure field mappings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search canonical fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sample Source Fields */}
                {currentCategory && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-600 mb-2">Available Source Fields:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCategory.sampleFields.map(field => (
                        <code 
                          key={field} 
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-600 cursor-help"
                          title="Click a text input below and type this field name"
                        >
                          {field}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mapping Form */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredCanonicalFields.map((field) => (
                    <div 
                      key={field.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        mappings[field.field_name]?.trim()
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : field.required
                            ? 'border-amber-200 bg-amber-50/30'
                            : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Canonical Field */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-sm font-mono">
                              {field.field_name}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {field.data_type}
                            </Badge>
                            {field.required && (
                              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{field.description}</p>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center pt-2">
                          <ArrowRight className="w-5 h-5 text-slate-400" />
                        </div>

                        {/* Source Field Input */}
                        <div className="w-48">
                          <Input
                            placeholder="Source field name"
                            value={mappings[field.field_name] || ''}
                            onChange={(e) => handleMappingChange(field.field_name, e.target.value)}
                            className={mappings[field.field_name]?.trim() ? 'border-emerald-300' : ''}
                          />
                        </div>

                        {/* Status Icon */}
                        <div className="pt-2">
                          {mappings[field.field_name]?.trim() ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : field.required ? (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          ) : (
                            <div className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* JSON Preview */}
                <Card className="border-slate-200 bg-slate-50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      Generated Mapping Rules (JSON)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-3 rounded bg-slate-900 text-slate-100 text-xs overflow-x-auto">
                      {JSON.stringify(
                        Object.entries(mappings)
                          .filter(([_, v]) => v.trim())
                          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
                        null,
                        2
                      )}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchemaMapper;
