﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ThyroidDataEntities : DbContext
    {
        public ThyroidDataEntities()
            : base("name=ThyroidDataEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<disease_information> disease_information { get; set; }
        public virtual DbSet<user> user { get; set; }
        public virtual DbSet<patient_report> patient_report { get; set; }
        public virtual DbSet<diagnosis> diagnosis { get; set; }
        public virtual DbSet<patient_information> patient_information { get; set; }
        public virtual DbSet<disease_forum> disease_forum { get; set; }
        public virtual DbSet<forum_comment> forum_comment { get; set; }
        public virtual DbSet<drug_dosage> drug_dosage { get; set; }
    }
}
