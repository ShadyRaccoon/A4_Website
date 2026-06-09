using a4_backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Controllers;

public class PostController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public PostController(AppDbContext context)
    {
        _context = context;
    }
    
    /// TODO    - GET POSTS
    ///         - CREATE POST
    ///         - DELETE POST
    ///         - HIDE/UNHIDE POST
}