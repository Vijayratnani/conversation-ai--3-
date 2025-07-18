"use client"

import { useState } from "react"
import { Settings, FolderOpen, Server, Eye, EyeOff, TestTube, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

interface VoiceRepositoryConfigProps {
  open: boolean // 'open' is now mandatory
  onOpenChange: (open: boolean) => void // 'onOpenChange' is now mandatory
}

type ConnectionType = "local" | "ftp" | "sftp" | "smb" | "s3"

interface ConnectionConfig {
  type: ConnectionType
  name: string
  host?: string
  port?: number
  username?: string
  password?: string
  path: string
  useSSL?: boolean
  accessKey?: string
  secretKey?: string
  bucket?: string
  region?: string
}

export function VoiceRepositoryConfig({ open, onOpenChange }: VoiceRepositoryConfigProps) {
  const [activeTab, setActiveTab] = useState("local")
  const [showPassword, setShowPassword] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [connectionMessage, setConnectionMessage] = useState("")

  const [config, setConfig] = useState<ConnectionConfig>({
    type: "local",
    name: "",
    path: "/var/voice-samples",
  })

  const [savedConfigs, setSavedConfigs] = useState<ConnectionConfig[]>([
    {
      type: "local",
      name: "Local Storage",
      path: "/var/voice-samples",
    },
    {
      type: "sftp",
      name: "Production Server",
      host: "prod-server.company.com",
      port: 22,
      username: "voice-admin",
      path: "/data/voice-samples",
      useSSL: true,
    },
  ])

  const handleConfigChange = (field: keyof ConnectionConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (type: ConnectionType) => {
    setActiveTab(type)
    setConfig((prev) => ({
      ...prev,
      type,
      // Reset type-specific fields
      host: type === "local" ? undefined : prev.host,
      port: type === "local" ? undefined : getDefaultPort(type),
      username: type === "local" ? undefined : prev.username,
      password: type === "local" ? undefined : prev.password,
      useSSL: type === "local" ? undefined : type === "sftp",
      accessKey: type === "s3" ? prev.accessKey : undefined,
      secretKey: type === "s3" ? prev.secretKey : undefined,
      bucket: type === "s3" ? prev.bucket : undefined,
      region: type === "s3" ? prev.region || "us-east-1" : undefined,
    }))
  }

  const getDefaultPort = (type: ConnectionType): number => {
    switch (type) {
      case "ftp":
        return 21
      case "sftp":
        return 22
      case "smb":
        return 445
      default:
        return 22
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure based on config completeness
      const isValid = config.name && config.path && (config.type === "local" || (config.host && config.username))

      if (isValid) {
        setConnectionStatus("success")
        setConnectionMessage("Connection successful! Repository is accessible.")
      } else {
        setConnectionStatus("error")
        setConnectionMessage("Connection failed. Please check your credentials and try again.")
      }
    } catch (error) {
      setConnectionStatus("error")
      setConnectionMessage("Connection failed. Please check your credentials and try again.")
    } finally {
      setIsTestingConnection(false)
    }
  }

  const saveConfiguration = () => {
    if (!config.name || !config.path) {
      setConnectionStatus("error")
      setConnectionMessage("Please fill in all required fields.")
      return
    }

    const newConfig = { ...config }
    setSavedConfigs((prev) => {
      const existingIndex = prev.findIndex((c) => c.name === newConfig.name)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newConfig
        return updated
      }
      return [...prev, newConfig]
    })

    setConnectionStatus("success")
    setConnectionMessage("Configuration saved successfully!")

    setTimeout(() => {
      onOpenChange(false) // Ensure this uses the prop to close the dialog
      setConnectionStatus("idle")
      setConnectionMessage("")
    }, 1500)
  }

  const loadConfiguration = (savedConfig: ConnectionConfig) => {
    setConfig(savedConfig)
    setActiveTab(savedConfig.type)
  }

  const deleteConfiguration = (configName: string) => {
    setSavedConfigs((prev) => prev.filter((c) => c.name !== configName))
  }

  if (!open) {
    return null // If not open, render nothing
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogTrigger is GONE. The trigger button is now in the parent component. */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Repository Configuration
          </DialogTitle>
          <DialogDescription>Configure connections to local or remote voice sample repositories</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(value) => handleTypeChange(value as ConnectionType)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="local" className="flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  Local
                </TabsTrigger>
                <TabsTrigger value="ftp" className="flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  FTP
                </TabsTrigger>
                <TabsTrigger value="sftp" className="flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  SFTP
                </TabsTrigger>
                <TabsTrigger value="smb" className="flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  SMB
                </TabsTrigger>
                <TabsTrigger value="s3" className="flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  S3
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-name">Configuration Name *</Label>
                    <Input
                      id="config-name"
                      placeholder="e.g., Production Server"
                      value={config.name}
                      onChange={(e) => handleConfigChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="config-path">Repository Path *</Label>
                    <Input
                      id="config-path"
                      placeholder={config.type === "s3" ? "folder-name" : "/path/to/voice/samples"}
                      value={config.path}
                      onChange={(e) => handleConfigChange("path", e.target.value)}
                    />
                  </div>
                </div>

                {/* Local Directory Configuration */}
                <TabsContent value="local" className="space-y-4 mt-4">
                  <Alert>
                    <FolderOpen className="h-4 w-4" />
                    <AlertDescription>
                      Local directory configuration allows access to voice samples stored on the same server as the
                      application. Ensure the application has read/write permissions to the specified directory.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* FTP Configuration */}
                <TabsContent value="ftp" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ftp-host">FTP Server *</Label>
                      <Input
                        id="ftp-host"
                        placeholder="ftp.example.com"
                        value={config.host || ""}
                        onChange={(e) => handleConfigChange("host", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ftp-port">Port</Label>
                      <Input
                        id="ftp-port"
                        type="number"
                        placeholder="21"
                        value={config.port || ""}
                        onChange={(e) => handleConfigChange("port", Number.parseInt(e.target.value) || 21)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ftp-username">Username *</Label>
                      <Input
                        id="ftp-username"
                        placeholder="username"
                        value={config.username || ""}
                        onChange={(e) => handleConfigChange("username", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ftp-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="ftp-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          value={config.password || ""}
                          onChange={(e) => handleConfigChange("password", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ftp-ssl"
                      checked={config.useSSL || false}
                      onCheckedChange={(checked) => handleConfigChange("useSSL", checked)}
                    />
                    <Label htmlFor="ftp-ssl">Use SSL/TLS (FTPS)</Label>
                  </div>
                </TabsContent>

                {/* SFTP Configuration */}
                <TabsContent value="sftp" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sftp-host">SFTP Server *</Label>
                      <Input
                        id="sftp-host"
                        placeholder="sftp.example.com"
                        value={config.host || ""}
                        onChange={(e) => handleConfigChange("host", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sftp-port">Port</Label>
                      <Input
                        id="sftp-port"
                        type="number"
                        placeholder="22"
                        value={config.port || ""}
                        onChange={(e) => handleConfigChange("port", Number.parseInt(e.target.value) || 22)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sftp-username">Username *</Label>
                      <Input
                        id="sftp-username"
                        placeholder="username"
                        value={config.username || ""}
                        onChange={(e) => handleConfigChange("username", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sftp-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="sftp-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          value={config.password || ""}
                          onChange={(e) => handleConfigChange("password", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>
                      SFTP connections are encrypted by default. You can also use SSH key authentication instead of
                      password authentication for enhanced security.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* SMB Configuration */}
                <TabsContent value="smb" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smb-host">SMB Server *</Label>
                      <Input
                        id="smb-host"
                        placeholder="\\\\server\\share or smb://server/share"
                        value={config.host || ""}
                        onChange={(e) => handleConfigChange("host", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smb-port">Port</Label>
                      <Input
                        id="smb-port"
                        type="number"
                        placeholder="445"
                        value={config.port || ""}
                        onChange={(e) => handleConfigChange("port", Number.parseInt(e.target.value) || 445)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smb-username">Username *</Label>
                      <Input
                        id="smb-username"
                        placeholder="domain\\username"
                        value={config.username || ""}
                        onChange={(e) => handleConfigChange("username", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smb-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="smb-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          value={config.password || ""}
                          onChange={(e) => handleConfigChange("password", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* S3 Configuration */}
                <TabsContent value="s3" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s3-bucket">S3 Bucket *</Label>
                      <Input
                        id="s3-bucket"
                        placeholder="my-voice-samples-bucket"
                        value={config.bucket || ""}
                        onChange={(e) => handleConfigChange("bucket", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s3-region">Region</Label>
                      <Select
                        value={config.region || "us-east-1"}
                        onValueChange={(value) => handleConfigChange("region", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s3-access-key">Access Key ID *</Label>
                      <Input
                        id="s3-access-key"
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        value={config.accessKey || ""}
                        onChange={(e) => handleConfigChange("accessKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s3-secret-key">Secret Access Key *</Label>
                      <div className="relative">
                        <Input
                          id="s3-secret-key"
                          type={showPassword ? "text" : "password"}
                          placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                          value={config.secretKey || ""}
                          onChange={(e) => handleConfigChange("secretKey", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Ensure your AWS credentials have the necessary permissions to read and write to the specified S3
                      bucket.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* Connection Status */}
                {connectionStatus !== "idle" && (
                  <Alert
                    className={
                      connectionStatus === "success"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                    }
                  >
                    {connectionStatus === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        connectionStatus === "success"
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      }
                    >
                      {connectionMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    {isTestingConnection ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button
                    onClick={saveConfiguration}
                    disabled={isTestingConnection}
                    className="flex items-center gap-2"
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Saved Configurations */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Saved Configurations</CardTitle>
                <CardDescription className="text-xs">Manage your repository connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedConfigs.map((savedConfig, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{savedConfig.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {savedConfig.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {savedConfig.type === "s3"
                        ? `s3://${savedConfig.bucket}/${savedConfig.path}`
                        : savedConfig.type === "local"
                          ? savedConfig.path
                          : `${savedConfig.host}:${savedConfig.path}`}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={() => loadConfiguration(savedConfig)}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs text-red-600 hover:text-red-700"
                        onClick={() => deleteConfiguration(savedConfig.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {savedConfigs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No saved configurations</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
