using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LightActorCore.Models;
using LightActorCore.Services;

namespace LightActorCore.Controllers.Admin
{
    [Route("api/admin/assets")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AssetManagementController : ControllerBase
    {
        private readonly IAssetService _assetService;
        
        public AssetManagementController(IAssetService assetService)
        {
            _assetService = assetService;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAllAssets()
        {
            try
            {
                var assets = await _assetService.GetAllAsync();
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAsset(long id)
        {
            try
            {
                var asset = await _assetService.GetByIdAsync(id);
                if (asset == null)
                {
                    return NotFound();
                }
                return Ok(asset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsset(long id, Asset asset)
        {
            if (id != asset.Id)
            {
                return BadRequest();
            }
            
            try
            {
                await _assetService.UpdateAsync(asset);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(long id)
        {
            try
            {
                await _assetService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
} 