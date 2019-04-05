using System.ServiceProcess;
using SampleWindowsService.Services;

namespace SampleWindowsService
{
    class Program
    {
        static void Main(string[] args)
        {
            //Launch service
            ServiceBase.Run(new SampleService());
        }
    }
}
