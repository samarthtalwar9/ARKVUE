import type { Lead, LeadSource, LeadStatus } from '../types'

const row = (
  n: number,
  name: string,
  company: string,
  email: string,
  phone: string,
  source: LeadSource,
  status: LeadStatus,
  createdAt: string,
): Lead => ({ id: `seed-${n}`, name, company, email, phone, source, status, createdAt })

export const INITIAL_LEADS: Lead[] = [
  row(1, 'Aarav Kulkarni', 'Vistara Tech', 'aarav@vistaratech.in', '+91 98765 43210', 'Website', 'New', '2026-11-23T11:20:00'),
  row(2, 'Priya Sharma', 'Nimbus Solutions', 'priya@nimbus.in', '+91 91234 56789', 'Referral', 'Contacted', '2026-11-22T15:05:00'),
  row(3, 'Rohan Verma', 'CodeNest', 'rohan@codenest.com', '+91 99876 54321', 'LinkedIn', 'Qualified', '2026-11-21T12:40:00'),
  row(4, 'Sneha More', 'BrightOps', 'sneha@brightops.in', '+91 90123 45678', 'Event', 'Converted', '2026-11-21T09:10:00'),
  row(5, 'Dhruv Patil', 'Orion Systems', 'dhruv@orion.in', '+91 93456 78901', 'Website', 'Contacted', '2026-11-20T17:30:00'),
  row(6, 'Ananya Deshmukh', 'Pixel Forge', 'ananya@pixelforge.io', '+91 98220 11223', 'LinkedIn', 'New', '2026-11-20T10:00:00'),
  row(7, 'Vikram Joshi', 'Helix Labs', 'vikram@helixlabs.in', '+91 98230 44556', 'Referral', 'Qualified', '2026-11-19T16:45:00'),
  row(8, 'Neha Kapoor', 'Zenith Retail', 'neha@zenithretail.com', '+91 97654 32109', 'Event', 'Contacted', '2026-11-19T11:15:00'),
  row(9, 'Karan Mehta', 'Quanta Finserv', 'karan@quantafin.in', '+91 98901 23456', 'Website', 'New', '2026-11-18T14:20:00'),
  row(10, 'Ishita Rao', 'GreenLeaf Foods', 'ishita@greenleaf.in', '+91 99887 76655', 'Other', 'Contacted', '2026-11-18T09:50:00'),
  row(11, 'Aditya Nair', 'Skyline Infra', 'aditya@skylineinfra.in', '+91 98111 22334', 'LinkedIn', 'Converted', '2026-11-17T13:35:00'),
  row(12, 'Meera Iyer', 'Lumen Health', 'meera@lumenhealth.in', '+91 98450 67890', 'Referral', 'Qualified', '2026-11-17T10:25:00'),
  row(13, 'Siddharth Jain', 'Apex Logistics', 'sid@apexlogistics.in', '+91 98765 11122', 'Website', 'Contacted', '2026-11-16T18:00:00'),
  row(14, 'Riya Bhatt', 'Nova Edu', 'riya@novaedu.in', '+91 90909 80808', 'Event', 'New', '2026-11-16T12:10:00'),
  row(15, 'Arjun Singh', 'Kinetic Motors', 'arjun@kineticmotors.in', '+91 98333 99887', 'LinkedIn', 'Contacted', '2026-11-15T15:40:00'),
  row(16, 'Kavya Menon', 'BlueWave Media', 'kavya@bluewave.in', '+91 98765 90123', 'Website', 'Qualified', '2026-11-15T09:30:00'),
  row(17, 'Harsh Agarwal', 'TerraByte', 'harsh@terrabyte.io', '+91 99001 12233', 'Other', 'New', '2026-11-14T16:15:00'),
  row(18, 'Tanvi Kulkarni', 'Saffron Hospitality', 'tanvi@saffronhq.in', '+91 98220 99887', 'Referral', 'Converted', '2026-11-14T11:05:00'),
  row(19, 'Yash Thakur', 'CloudMint', 'yash@cloudmint.in', '+91 97000 11122', 'Website', 'Contacted', '2026-11-13T14:50:00'),
  row(20, 'Pooja Naik', 'Veda Pharma', 'pooja@vedapharma.in', '+91 98765 55667', 'Event', 'Qualified', '2026-11-13T10:20:00'),
  row(21, 'Manish Gupta', 'Ironclad Security', 'manish@ironclad.in', '+91 98100 23456', 'LinkedIn', 'New', '2026-11-12T17:10:00'),
  row(22, 'Shruti Pawar', 'Craftly', 'shruti@craftly.in', '+91 98905 67812', 'Website', 'Contacted', '2026-11-12T09:45:00'),
  row(23, 'Rahul Choudhary', 'Matrix Analytics', 'rahul@matrixanalytics.in', '+91 99220 33445', 'Referral', 'New', '2026-11-11T13:25:00'),
  row(24, 'Divya Reddy', 'Aurora Travel', 'divya@auroratravel.in', '+91 98480 76543', 'Other', 'Converted', '2026-11-11T10:35:00'),
  row(25, 'Nikhil Bansal', 'Stackwise', 'nikhil@stackwise.dev', '+91 98710 65432', 'LinkedIn', 'Qualified', '2026-11-10T15:55:00'),
  row(26, 'Aisha Khan', 'Mosaic Interiors', 'aisha@mosaicinteriors.in', '+91 99300 87654', 'Event', 'Contacted', '2026-11-10T11:00:00'),
  row(27, 'Gaurav Kulshreshtha', 'Pinnacle Auto', 'gaurav@pinnacleauto.in', '+91 98765 33445', 'Website', 'New', '2026-11-09T16:20:00'),
  row(28, 'Simran Kaur', 'Fintrail', 'simran@fintrail.in', '+91 98150 44556', 'Referral', 'Contacted', '2026-11-09T10:10:00'),
  row(29, 'Omkar Shinde', 'AgroSense', 'omkar@agrosense.in', '+91 98604 55667', 'Other', 'New', '2026-11-08T14:05:00'),
  row(30, 'Tara Fernandes', 'Coastal Brew', 'tara@coastalbrew.in', '+91 98230 88776', 'Event', 'Converted', '2026-11-08T09:25:00'),
]

/** Baseline figures for the whole database (the table above is a sample). */
export const BASELINE = {
  total: 248,
  byStatus: { New: 67, Contacted: 114, Converted: 42 } as Record<string, number>,
  bySource: { Website: 89, Referral: 55, LinkedIn: 45, Event: 30, Other: 29 } as Record<string, number>,
}

export const TREND_7: { day: string; leads: number }[] = [
  { day: 'Nov 16', leads: 10 },
  { day: 'Nov 17', leads: 25 },
  { day: 'Nov 18', leads: 21 },
  { day: 'Nov 19', leads: 36 },
  { day: 'Nov 20', leads: 24 },
  { day: 'Nov 21', leads: 37 },
  { day: 'Nov 22', leads: 34 },
  { day: 'Nov 23', leads: 48 },
]

export const TREND_14: { day: string; leads: number }[] = [
  { day: 'Nov 9', leads: 8 },
  { day: 'Nov 10', leads: 14 },
  { day: 'Nov 11', leads: 12 },
  { day: 'Nov 12', leads: 22 },
  { day: 'Nov 13', leads: 18 },
  { day: 'Nov 14', leads: 27 },
  { day: 'Nov 15', leads: 20 },
  ...TREND_7,
]
