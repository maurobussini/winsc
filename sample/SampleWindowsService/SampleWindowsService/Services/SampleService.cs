using System;
using System.IO;
using System.ServiceProcess;

namespace SampleWindowsService.Services
{
    /// <summary>
    /// Sample windows service that writes on local file
    /// </summary>
    public class SampleService: ServiceBase
    {
        private string _FilePath;

        /// <summary>
        /// Constructor
        /// </summary>
        public SampleService()
        {
            //Generate file name
            string name = DateTime.Now.ToString("yyyyMMdd-HHmmss") + ".txt";
            _FilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, name);
        }

        /// <summary>
        /// Raised when service is started
        /// </summary>
        /// <param name="args">Arguments</param>
        protected override void OnStart(string[] args)
        {
            //Write current action and date on file
            File.AppendAllText(_FilePath, DateTime.Now.ToString("HH:mm:ss") + " Service was started!");

            //Base action
            base.OnStart(args);
        }

        /// <summary>
        /// Raised when service is stopped
        /// </summary>
        protected override void OnStop()
        {
            //Write current action and date on file
            File.AppendAllText(_FilePath, DateTime.Now.ToString("HH:mm:ss") + " Service was stopped!");

            //Base action
            base.OnStop();
        }
    }
}
