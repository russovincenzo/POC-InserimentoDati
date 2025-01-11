namespace POC_InserimentoDati.SoftwareApi.Data;

public class InvalidConfigurationException : Exception
{
    public InvalidConfigurationException(string index, Exception innerException)
        : base("Miss value for index: " + index, innerException)
    {
    }

    public InvalidConfigurationException()
    {
    }

    public InvalidConfigurationException(string index)
        : base("Miss value for index: " + index)
    {
    }
}