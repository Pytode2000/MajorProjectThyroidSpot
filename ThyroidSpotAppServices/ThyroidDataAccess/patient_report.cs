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
    
    public partial class patient_report
    {
        public int report_id { get; set; }
        public int patient_id { get; set; }
        public double FT4 { get; set; }
        public double TSH { get; set; }
        public string timestamp { get; set; }
    }
}
