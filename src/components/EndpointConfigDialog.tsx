import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  target_url?: string;
  target_method?: string;
  requires_auth?: boolean;
  auth_type?: string;
  auth_header_name?: string;
  timeout_ms?: number;
  rate_limit_per_minute?: number;
  cost_per_request?: number;
}

interface ApiConfig {
  config_name: string;
  config_value: string;
  is_encrypted?: boolean;
}

interface EndpointConfigDialogProps {
  endpoint: ApiEndpoint | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EndpointConfigDialog = ({ endpoint, isOpen, onClose, onSave }: EndpointConfigDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    target_url: "",
    target_method: "GET",
    requires_auth: true,
    auth_type: "bearer",
    auth_header_name: "Authorization",
    timeout_ms: 30000,
    rate_limit_per_minute: 0,
    cost_per_request: 1,
  });

  const [customConfigs, setCustomConfigs] = useState<ApiConfig[]>([]);
  const [newConfig, setNewConfig] = useState({ config_name: "", config_value: "", is_encrypted: false });

  useEffect(() => {
    if (endpoint && isOpen) {
      setConfig({
        target_url: endpoint.target_url || "",
        target_method: endpoint.target_method || endpoint.method,
        requires_auth: endpoint.requires_auth ?? true,
        auth_type: endpoint.auth_type || "bearer",
        auth_header_name: endpoint.auth_header_name || "Authorization",
        timeout_ms: endpoint.timeout_ms || 30000,
        rate_limit_per_minute: endpoint.rate_limit_per_minute || 0,
        cost_per_request: endpoint.cost_per_request || 1,
      });
      
      loadCustomConfigs();
    }
  }, [endpoint, isOpen]);

  const loadCustomConfigs = async () => {
    if (!endpoint) return;

    const { data, error } = await supabase
      .from('api_target_configs')
      .select('config_name, config_value, is_encrypted')
      .eq('endpoint_id', endpoint.id);

    if (error) {
      console.error('Error loading configs:', error);
      return;
    }

    setCustomConfigs(data || []);
  };

  const handleSave = async () => {
    if (!endpoint) return;

    setLoading(true);
    try {
      // Update endpoint configuration
      const { error: endpointError } = await supabase
        .from('api_endpoints')
        .update(config)
        .eq('id', endpoint.id);

      if (endpointError) throw endpointError;

      // Delete existing configs
      await supabase
        .from('api_target_configs')
        .delete()
        .eq('endpoint_id', endpoint.id);

      // Insert new configs
      if (customConfigs.length > 0) {
        const configsToInsert = customConfigs.map(cfg => ({
          endpoint_id: endpoint.id,
          ...cfg,
        }));

        const { error: configError } = await supabase
          .from('api_target_configs')
          .insert(configsToInsert);

        if (configError) throw configError;
      }

      toast({
        title: "Configuration saved",
        description: "Endpoint configuration has been updated successfully.",
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save endpoint configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomConfig = () => {
    if (newConfig.config_name && newConfig.config_value) {
      setCustomConfigs([...customConfigs, { ...newConfig }]);
      setNewConfig({ config_name: "", config_value: "", is_encrypted: false });
    }
  };

  const removeCustomConfig = (index: number) => {
    setCustomConfigs(customConfigs.filter((_, i) => i !== index));
  };

  if (!endpoint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Endpoint: {endpoint.path}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold">Target Configuration</h3>
            
            <div>
              <Label htmlFor="target_url">Target URL</Label>
              <Input
                id="target_url"
                value={config.target_url}
                onChange={(e) => setConfig({ ...config, target_url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div>
              <Label htmlFor="target_method">Target Method</Label>
              <Select value={config.target_method} onValueChange={(value) => setConfig({ ...config, target_method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeout_ms">Timeout (ms)</Label>
                <Input
                  id="timeout_ms"
                  type="number"
                  value={config.timeout_ms}
                  onChange={(e) => setConfig({ ...config, timeout_ms: parseInt(e.target.value) || 30000 })}
                />
              </div>

              <div>
                <Label htmlFor="cost_per_request">Cost per Request</Label>
                <Input
                  id="cost_per_request"
                  type="number"
                  value={config.cost_per_request}
                  onChange={(e) => setConfig({ ...config, cost_per_request: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          {/* Authentication Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold">Authentication</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_auth"
                checked={config.requires_auth}
                onCheckedChange={(value) => setConfig({ ...config, requires_auth: value })}
              />
              <Label htmlFor="requires_auth">Requires Authentication</Label>
            </div>

            {config.requires_auth && (
              <>
                <div>
                  <Label htmlFor="auth_type">Auth Type</Label>
                  <Select value={config.auth_type} onValueChange={(value) => setConfig({ ...config, auth_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="auth_header_name">Auth Header Name</Label>
                  <Input
                    id="auth_header_name"
                    value={config.auth_header_name}
                    onChange={(e) => setConfig({ ...config, auth_header_name: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Rate Limiting */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rate Limiting</h3>
            <div>
              <Label htmlFor="rate_limit_per_minute">Requests per Minute (0 = unlimited)</Label>
              <Input
                id="rate_limit_per_minute"
                type="number"
                value={config.rate_limit_per_minute}
                onChange={(e) => setConfig({ ...config, rate_limit_per_minute: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Custom Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold">Custom Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Add custom headers or API keys needed for the target API. Use "header_" prefix for custom headers.
            </p>
            
            <div className="space-y-2">
              {customConfigs.map((cfg, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Badge variant="outline">{cfg.config_name}</Badge>
                  <span className="text-sm">
                    {cfg.is_encrypted ? "••••••••" : cfg.config_value}
                  </span>
                  {cfg.is_encrypted && <Badge variant="secondary" className="text-xs">Encrypted</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomConfig(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Config name (e.g., api_key, header_custom)"
                value={newConfig.config_name}
                onChange={(e) => setNewConfig({ ...newConfig, config_name: e.target.value })}
              />
              <Input
                placeholder="Config value"
                type={newConfig.is_encrypted ? "password" : "text"}
                value={newConfig.config_value}
                onChange={(e) => setNewConfig({ ...newConfig, config_value: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newConfig.is_encrypted}
                  onCheckedChange={(value) => setNewConfig({ ...newConfig, is_encrypted: value })}
                />
                <Label className="text-xs">Encrypt</Label>
              </div>
              <Button onClick={addCustomConfig} disabled={!newConfig.config_name || !newConfig.config_value}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndpointConfigDialog;