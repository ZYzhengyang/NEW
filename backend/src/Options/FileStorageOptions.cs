namespace LightActorCore.Options;

public class FileStorageOptions
{
    public string BasePath { get; set; } = "uploads";
    public string[] AllowedExtensions { get; set; } = Array.Empty<string>();
    public long MaxFileSize { get; set; } = 104857600; // 100MB
} 