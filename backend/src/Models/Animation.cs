namespace LightActorCore.Models;

public class Animation
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public float Duration { get; set; }
    public string FilePath { get; set; } = null!;
    public long AssetId { get; set; }

    public Asset Asset { get; set; } = null!;
} 