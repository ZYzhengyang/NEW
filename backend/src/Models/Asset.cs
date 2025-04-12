namespace LightActorCore.Models;

public class Asset
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public AssetType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public long UserId { get; set; }
    public long CategoryId { get; set; }

    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Animation> Animations { get; set; } = new List<Animation>();
}

public enum AssetType
{
    Model,
    Texture,
    Audio,
    Other
} 