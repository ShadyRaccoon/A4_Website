using a4_backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Controllers;

public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .Select(d => new { d.DepartmentId, d.Name, d.Alias })
            .ToListAsync();
        
        return Ok(departments);
    }
}