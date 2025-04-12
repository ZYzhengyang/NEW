using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LightActorCore.Infrastructure;
using LightActorCore.Models;

namespace LightActorCore.Services
{
    public class AssetService : IAssetService
    {
        private readonly AppDbContext _context;

        public AssetService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Asset> CreateAssetAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<Asset> GetAssetByIdAsync(long id)
        {
            return await _context.Assets.FindAsync(id);
        }

        public async Task<IEnumerable<Asset>> GetAssetsAsync()
        {
            return await _context.Assets.ToListAsync();
        }

        public async Task UpdateAssetAsync(Asset asset)
        {
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAssetAsync(long id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
            }
        }

        // 添加缺少的接口方法实现
        public async Task<Asset> GetByIdAsync(long id)
        {
            return await _context.Assets.FindAsync(id);
        }

        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            return await _context.Assets.ToListAsync();
        }

        public async Task<Asset> UpdateAsync(Asset asset)
        {
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task DeleteAsync(long id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Asset>> GetRecentAssetsAsync(int count)
        {
            return await _context.Assets
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.Assets.CountAsync();
        }
    }
}