using Microsoft.EntityFrameworkCore;
using TaskAspNet.Data.Entities;


namespace TaskAspNet.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<MemberEntity> Members { get; set; }
        public DbSet<ProjectEntity> Projects { get; set; }
        public DbSet<ClientEntity> Clients { get; set; }
        public DbSet<JobTitleEntity> JobTitles { get; set; }
        public DbSet<ProjectStatusEntity> ProjectStatuses { get; set; }
        public DbSet<ProjectMemberEntity> ProjectMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<ProjectMemberEntity>()
                .HasKey(pm => new { pm.ProjectId, pm.MemberId });

            modelBuilder.Entity<ProjectMemberEntity>()
                .HasOne(pm => pm.Project)
                .WithMany(p => p.ProjectMembers)
                .HasForeignKey(pm => pm.ProjectId);

            modelBuilder.Entity<ProjectMemberEntity>()
                .HasOne(pm => pm.Member)
                .WithMany(m => m.ProjectMembers)
                .HasForeignKey(pm => pm.MemberId);

            // Seed 
            modelBuilder.Entity<JobTitleEntity>().HasData(
                new JobTitleEntity { Id = 1, Title = "Developer" },
                new JobTitleEntity { Id = 2, Title = "Designer" },
                new JobTitleEntity { Id = 3, Title = "Project Manager" }
            );

            
            modelBuilder.Entity<ProjectStatusEntity>().HasData(
                new ProjectStatusEntity { Id = 1, StatusName = "Started" },
                new ProjectStatusEntity { Id = 2, StatusName = "Completed" }
            );

            
            modelBuilder.Entity<ClientEntity>().HasData(
                new ClientEntity { Id = 1, ClientName = "Acme Corporation" },
                new ClientEntity { Id = 2, ClientName = "TechStart Inc." },
                new ClientEntity { Id = 3, ClientName = "Global Solutions Ltd." }
            );

            
            modelBuilder.Entity<MemberEntity>().HasData(
                new MemberEntity 
                { 
                    Id = 1, 
                    FirstName = "John", 
                    LastName = "Doe", 
                    Email = "john.doe@example.com", 
                    Phone = "555-0101", 
                    JobTitleId = 1, 
                    Address = "123 Main St", 
                    ZipCode = "12345", 
                    City = "New York", 
                    DateOfBirth = new DateTime(1990, 1, 1) 
                },
                new MemberEntity 
                { 
                    Id = 2, 
                    FirstName = "Jane", 
                    LastName = "Smith", 
                    Email = "jane.smith@example.com", 
                    Phone = "555-0102", 
                    JobTitleId = 2, 
                    Address = "456 Oak Ave", 
                    ZipCode = "67890", 
                    City = "Los Angeles", 
                    DateOfBirth = new DateTime(1992, 3, 15) 
                },
                new MemberEntity 
                { 
                    Id = 3, 
                    FirstName = "Mike", 
                    LastName = "Johnson", 
                    Email = "mike.johnson@example.com", 
                    Phone = "555-0103", 
                    JobTitleId = 3, 
                    Address = "789 Pine Rd", 
                    ZipCode = "13579", 
                    City = "Chicago", 
                    DateOfBirth = new DateTime(1988, 7, 22) 
                }
            );

            
            modelBuilder.Entity<ProjectEntity>().HasData(
                new ProjectEntity 
                { 
                    Id = 1, 
                    Name = "Website Redesign", 
                    Description = "Complete overhaul of company website", 
                    StartDate = new DateTime(2024, 1, 1), 
                    EndDate = new DateTime(2024, 6, 30), 
                    ClientId = 1, 
                    StatusId = 1, 
                    Budget = 50000.00m 
                },
                new ProjectEntity 
                { 
                    Id = 2, 
                    Name = "Mobile App Development", 
                    Description = "New iOS and Android app development", 
                    StartDate = new DateTime(2024, 2, 1), 
                    EndDate = new DateTime(2024, 8, 31), 
                    ClientId = 2, 
                    StatusId = 1, 
                    Budget = 75000.00m 
                },
                new ProjectEntity 
                { 
                    Id = 3, 
                    Name = "E-commerce Platform", 
                    Description = "Online store development", 
                    StartDate = new DateTime(2024, 3, 1), 
                    EndDate = new DateTime(2024, 9, 30), 
                    ClientId = 3, 
                    StatusId = 1, 
                    Budget = 100000.00m 
                }
            );

            
            modelBuilder.Entity<ProjectMemberEntity>().HasData(
                new ProjectMemberEntity { ProjectId = 1, MemberId = 1 },
                new ProjectMemberEntity { ProjectId = 1, MemberId = 2 },
                new ProjectMemberEntity { ProjectId = 2, MemberId = 2 },
                new ProjectMemberEntity { ProjectId = 2, MemberId = 3 },
                new ProjectMemberEntity { ProjectId = 3, MemberId = 1 },
                new ProjectMemberEntity { ProjectId = 3, MemberId = 3 }
            );
        }
    }
}
