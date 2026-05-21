export interface AttendanceRecord {
  attendanceId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  branchName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  checkInStatus: string;
  checkOutStatus: string;
}

export interface GeneralReportRow {
  barbershopName: string;
  onTimeIn: number;
  onTimeOut: number;
}
