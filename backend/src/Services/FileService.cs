using Microsoft.Extensions.Options;
using LightActorCore.Options;

namespace LightActorCore.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IOptions<FileStorageOptions> _options;

    public FileService(IWebHostEnvironment environment, IOptions<FileStorageOptions> options)
    {
        _environment = environment;
        _options = options;
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        if (file.Length > _options.Value.MaxFileSize)
            throw new ArgumentException($"File size exceeds the maximum limit of {_options.Value.MaxFileSize} bytes");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_options.Value.AllowedExtensions.Contains(extension))
            throw new ArgumentException($"File extension {extension} is not allowed");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadPath = Path.Combine(_environment.WebRootPath, _options.Value.BasePath);
        Directory.CreateDirectory(uploadPath);

        var filePath = Path.Combine(uploadPath, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(_options.Value.BasePath, fileName);
    }

    public Task DeleteFileAsync(string filePath)
    {
        var fullPath = Path.Combine(_environment.WebRootPath, filePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
        return Task.CompletedTask;
    }

    public string GetFileUrl(string filePath)
    {
        return $"/{filePath.Replace("\\", "/")}";
    }
} 