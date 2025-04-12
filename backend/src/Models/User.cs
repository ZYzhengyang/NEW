namespace LightActorCore.Models;

public class User
{
    public long Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}

public enum UserRole
{
    User,
    Admin
} 