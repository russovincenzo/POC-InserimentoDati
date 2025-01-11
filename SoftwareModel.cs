using System.Collections.Generic;

namespace POC_InserimentoDati;

public class SoftwareModel
{
    public int Id { get; set; }
    public string? SoftwareId { get; set; }                // "SOUP-0016"
    public string? Name { get; set; }                      // "PyQt5"
    public string? Manufacturer { get; set; }              // "Riverbank Computing Limited (open-source software)"
    public string? Website { get; set; }                   // "PyQt5 by Riverbank Computing"
    public string? License { get; set; }                   // "Commercial License @@to be attached?"
    public string? Version { get; set; }                   // "5.15.11"
    public DateTime? ReleaseDate
    {
        get => _releaseDate;
        set => _releaseDate = value.SetKindUtc();
    }
    private DateTime? _releaseDate;
    private DateTime? _endOfSupportDate;
    public DateTime? EndOfSupportDate
    {
        get => _endOfSupportDate;
        set => _endOfSupportDate = value.SetKindUtc();
    }        // "May 26, 2025"
    public string? ProgrammingLanguage { get; set; }       // "Python, C++"
    public string? Units { get; set; }                     // "All units of Item 1"
    public string? HardwareSpecifications { get; set; }    // "-"
    public string? SoftwareSpecifications { get; set; }    // "Python >= 3.8..."
    public string? InstallationProcedures { get; set; }
    public string? ConfigurationRequirements { get; set; } // "-"
    public string? TrainingRequirements { get; set; }      // "No education..."
    public string? DesignLimitations { get; set; }         // "None"
    public string? MaintenanceProcedures { get; set; }
    public string? Function { get; set; }
    public string? MeasuresToPreventIncorrectVersion { get; set; } // "-"
    public string? Storage { get; set; }                   // "PyQt5 source code"
    public string? Documentation { get; set; }             // "PyQt5 documentation"
}

public static class DateTimeExtensions
{
    public static DateTime? SetKindUtc(this DateTime? dateTime)
    {
        if (dateTime.HasValue)
        {
            return dateTime.Value.SetKindUtc();
        }
        else
        {
            return null;
        }
    }
    public static DateTime SetKindUtc(this DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Utc) { return dateTime; }
        return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
    }
}