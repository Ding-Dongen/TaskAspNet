using TaskAspNet.Business.Dtos;

public class ProjectIndexViewModel
{
    public List<ProjectDto> AllProjects { get; set; } = new();
    public ProjectDto CreateProject { get; set; } = new();

    
}
