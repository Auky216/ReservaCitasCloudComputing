// components/medicos/medicos-header.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, HeartPulse, Activity } from "lucide-react";
import { AddMedicoDialog } from "./add-medico-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getMedicos } from "@/lib/api/medicos";

interface MedicosHeaderProps {
  onRefresh: () => Promise<void>;
}

// Componente para mostrar una estadística
function StatCard({ icon, label, value, bgColor }: { 
  icon: React.ReactNode, 
  label: string, 
  value: number | string,
  bgColor: string 
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2 rounded-full ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicosHeader({ onRefresh }: MedicosHeaderProps) {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    especialidades: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const medicos = await getMedicos();
      const especialidadesUnicas = new Set(medicos.map(m => m.especialidad)).size;
      
      setStats({
        total: medicos.length,
        // Simulando que 2/3 están activos
        activos: Math.ceil(medicos.length * 2/3),
        especialidades: especialidadesUnicas
      });
    };
    
    loadStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Médicos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el personal médico de tu institución
          </p>
        </div>
        <AddMedicoDialog onUpdate={onRefresh}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Agregar médico
          </Button>
        </AddMedicoDialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<Users className="h-5 w-5 text-blue-600" />} 
          label="Total médicos" 
          value={stats.total}
          bgColor="bg-blue-100" 
        />
        <StatCard 
          icon={<Activity className="h-5 w-5 text-green-600" />} 
          label="Médicos activos" 
          value={stats.activos}
          bgColor="bg-green-100" 
        />
        <StatCard 
          icon={<HeartPulse className="h-5 w-5 text-purple-600" />} 
          label="Especialidades" 
          value={stats.especialidades}
          bgColor="bg-purple-100" 
        />
      </div>
    </div>
  );
}