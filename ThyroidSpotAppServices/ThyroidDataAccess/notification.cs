//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ThyroidDataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class notification
    {
        public int notification_id { get; set; }
        public int patient_id { get; set; }
        public string notification_content { get; set; }
        public string seen { get; set; }
        public string timestamp { get; set; }
    }
}
