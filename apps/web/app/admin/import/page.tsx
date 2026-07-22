"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Upload, CheckCircle, XCircle, RefreshCw, FileText, Shield, AlertTriangle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useImportValidate, useImportConfirm } from "@/app/lib/hooks/useAdmin";

type ImportStep = "input" | "preview" | "result";

const IMPORT_TYPES = [
  { value: "faculties", label: "Faculties", description: "Faculty/School names, abbreviations" },
  { value: "departments", label: "Departments", description: "Department names linked to faculties" },
  { value: "programmes", label: "Programmes", description: "Full programme catalogue with codes, degrees" },
  { value: "subjects", label: "Subjects", description: "O Level and A Level subjects" },
  { value: "requirements", label: "Requirements", description: "Programme admission subject requirements" },
  { value: "tuition", label: "Tuition", description: "Programme tuition fees per academic year" },
  { value: "careers", label: "Careers", description: "Career names and descriptions" },
];

export default function AdminImportPage() {
  const [importType, setImportType] = useState("faculties");
  const [jsonInput, setJsonInput] = useState("");
  const [step, setStep] = useState<ImportStep>("input");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const validateMutation = useImportValidate();
  const confirmMutation = useImportConfirm();

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const parsedData = useMemo(() => {
    try {
      const p = JSON.parse(jsonInput);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [jsonInput]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setJsonInput(JSON.stringify(Array.isArray(parsed) ? parsed : [parsed], null, 2));
      } catch {
        showToast("error", "Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleValidate = async () => {
    if (!jsonInput.trim()) { showToast("error", "Please enter JSON data"); return; }
    if (parsedData.length === 0) { showToast("error", "No valid JSON array found"); return; }
    setLoading(true);
    try {
      const res = await validateMutation.mutateAsync({ type: importType, data: parsedData });
      setValidationResult(res.data || res);
      setStep("preview");
      const vr = (res.data?.validRows || res.validRows || 0);
      showToast("success", "Validation complete: " + vr + " valid rows");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await confirmMutation.mutateAsync({ type: importType, data: parsedData });
      setImportResult(res.data || res);
      setStep("result");
      showToast("success", "Import completed successfully");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJsonInput("");
    setStep("input");
    setValidationResult(null);
    setImportResult(null);
  };

  const currentType = IMPORT_TYPES.find(t => t.value === importType);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && (
        <div className={"fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg " + (toast.type === "success" ? "bg-green-600" : "bg-red-600")}>
          {toast.type === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span>{toast.message}</span>
        </div>
      )}
      <div className="mb-8">
        <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B2A4A] dark:bg-zinc-50">
            <Database className="h-5 w-5 text-white dark:text-[#1B2A4A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Data Import</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Bulk import data from JSON files - validate, preview, then confirm</p>
          </div>
      </div>
      <div className="mb-6 flex items-center gap-2">
        {(["input", "preview", "result"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={"flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium " + (step === s ? "bg-[#1B2A4A] text-white dark:bg-zinc-50 dark:text-[#1B2A4A]" : ((step === "preview" && s === "input") || (step === "result" && s !== "result")) ? "bg-green-500 text-white" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400")}>
              {(step === "preview" && s === "input") || (step === "result" && s !== "result") ? <CheckCircle className="h-4 w-4" /> : <span>{i + 1}</span>}
            </div>
            <span className={"text-sm " + (step === s ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400")}>
              {s === "input" ? "1. Input Data" : s === "preview" ? "2. Validate and Preview" : "3. Results"}
            </span>
            {i < 2 && <div className="mx-2 h-px w-8 bg-zinc-300 dark:bg-zinc-700" />}
          </div>
        ))}
      </div>
      {step === "input" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-[#0FA3B1]" /> Input Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Import Type</label>
              <select value={importType} onChange={(e) => setImportType(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
                {IMPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {currentType && <p className="mt-1 text-xs text-zinc-400">{currentType.description}</p>}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">JSON Data</label>
                <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  <Upload className="h-3 w-3" /> Upload .json file
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}
                rows={14} placeholder={'[\n  { "name": "Example" }\n]'}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" />
              <p className="mt-1 text-xs text-zinc-400">
                {parsedData.length > 0 ? parsedData.length + " row(s) parsed and ready for validation" : "Enter a JSON array of objects"}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Link href="/admin"><Button variant="outline">Cancel</Button></Link>
              <Button onClick={handleValidate} disabled={loading || !jsonInput.trim() || parsedData.length === 0}
                className="gap-1 bg-[#0FA3B1] hover:bg-[#0C8793] text-white">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Validate and Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {step === "preview" && validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-[#F5A623]" /> Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <Badge variant={validationResult.valid ? "success" : "secondary"}>{validationResult.valid ? "Valid" : "Has Errors"}</Badge>
              <span className="text-sm text-zinc-500">{validationResult.validRows} / {validationResult.totalRows} rows valid</span>
              {validationResult.errorRows > 0 && <span className="text-sm font-medium text-red-500">{validationResult.errorRows} error(s)</span>}
            </div>
            {validationResult.errors?.length > 0 && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">Validation Errors:</p>
                <div className="max-h-40 overflow-y-auto">
                  {validationResult.errors.map((err: any, i: number) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-300">Row {err.row}: <strong>{err.field}</strong> - {err.message}</p>
                  ))}
                </div>
            )}
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <th className="px-3 py-2 text-left font-medium text-zinc-500">#</th>
                    <th className="px-3 py-2 text-left font-medium text-zinc-500">Status</th>
                    {validationResult.preview?.[0] && Object.keys(validationResult.preview[0]).filter((k: string) => !k.startsWith("_")).map((key: string) => (
                      <th key={key} className="px-3 py-2 text-left font-medium text-zinc-500">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validationResult.preview?.slice(0, 50).map((row: any, i: number) => (
                    <tr key={i} className={"border-b border-zinc-100 dark:border-zinc-800 " + (!row._valid ? "bg-red-50 dark:bg-red-900/10" : "")}>
                      <td className="px-3 py-2 text-xs text-zinc-400">{i + 1}</td>
                      <td className="px-3 py-2">{row._valid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</td>
                      {Object.entries(row).filter(([k]) => !k.startsWith("_")).map(([key, val]: any, j: number) => (
                        <td key={j} className="px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300">{typeof val === "object" ? JSON.stringify(val) : String(val ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {validationResult.preview?.length > 50 && <p className="py-2 text-center text-xs text-zinc-400">Showing 50 of {validationResult.preview.length} rows</p>}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset}>Start Over</Button>
              <Button onClick={handleImport} disabled={loading || !validationResult.valid}
                className="gap-1 bg-[#1B2A4A] hover:bg-[#0F1B33] text-white dark:bg-zinc-50 dark:text-[#1B2A4A] dark:hover:bg-zinc-200">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Confirm Import ({validationResult.validRows} rows)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {step === "result" && importResult && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">{importResult.message}</h2>
            <p className="mb-6 text-sm text-zinc-500">{currentType?.label || importResult.type} import completed</p>
            <div className="mx-auto mb-6 grid max-w-md grid-cols-3 gap-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                <p className="text-2xl font-bold text-green-600">{importResult.created}</p>
                <p className="text-xs text-green-700 dark:text-green-400">Created</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-2xl font-bold text-zinc-400">{importResult.skipped || 0}</p>
                <p className="text-xs text-zinc-500">Skipped</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-600">{importResult.errors?.length || 0}</p>
                <p className="text-xs text-red-700 dark:text-red-400">Errors</p>
              </div>
            {importResult.errors?.length > 0 && (
              <div className="mx-auto mb-6 max-w-lg text-left">
                <p className="mb-2 text-sm font-medium text-red-600">Error Details:</p>
                <div className="max-h-32 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                  {importResult.errors.map((err: any, i: number) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-300">&bull; {err.item}: {err.reason}</p>
                  ))}
                </div>
            )}
            <div className="flex justify-center gap-3">
              <Button onClick={handleReset} className="gap-1 bg-[#0FA3B1] hover:bg-[#0C8793] text-white">
                <Upload className="h-4 w-4" /> Import More
              </Button>
              <Link href="/admin"><Button variant="outline" className="gap-1"><Shield className="h-4 w-4" /> Back to Dashboard</Button></Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
