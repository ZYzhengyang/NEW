using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LightActorCore.Models;
using LightActorCore.Services;

namespace LightActorCore.Controllers.Admin
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAssetService _assetService;
        
        public AdminController(IAssetService assetService)
        {
            _assetService = assetService;
        }
        
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            try
            {
                // 获取最近添加的资产
                var recentAssets = await _assetService.GetRecentAssetsAsync(10);
                
                // 获取统计信息
                var stats = new
                {
                    TotalAssets = await _assetService.GetTotalCountAsync(),
                    TotalAnimations = 0, // 待实现
                    TotalUsers = 0, // 待实现
                    TotalCategories = 0 // 待实现
                };
                
                return Ok(new
                {
                    RecentAssets = recentAssets,
                    Stats = stats,
                    SystemInfo = new
                    {
                        Version = "1.0.0",
                        LastUpdate = DateTime.Now
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
} 