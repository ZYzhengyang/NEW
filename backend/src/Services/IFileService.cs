namespace LightActorCore.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file);
    Task DeleteFileAsync(string filePath);
    string GetFileUrl(string filePath);
} 