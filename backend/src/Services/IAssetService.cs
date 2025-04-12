using Microsoft.AspNetCore.Http;
using LightActorCore.Models;

namespace LightActorCore.Services;

public interface IAssetService
{
    Task<Asset> CreateAssetAsync(Asset asset, IFormFile file);
    Task<Asset> GetAssetAsync(long id);
    Task<IEnumerable<Asset>> GetAssetsAsync();
    Task UpdateAssetAsync(Asset asset);
    Task DeleteAssetAsync(long id);
    Task<Asset> GetByIdAsync(long id);
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset> UpdateAsync(Asset asset);
    Task DeleteAsync(long id);
    Task<IEnumerable<Asset>> GetRecentAssetsAsync(int count);
    Task<int> GetTotalCountAsync();
} 