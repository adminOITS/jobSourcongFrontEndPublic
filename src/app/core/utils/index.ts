import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { InterviewStatus } from '../models/interview.models';
import { ApplicationStatus } from '../models/application.models';
import { StatusStyle } from '../types';
import { ContractType, EmploymentType, WorkMode } from '../models/offer.models';
import {
  CandidateCreationSource,
  CandidateValidationStatus,
  CandidateAvailabilityStatus,
} from '../models/candidate.models';
import { ContentType } from '../models/attachment.models';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.trim() !== '';
}

export function normalizeMonthYearDate(
  dateString: string | null | undefined
): string | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  // Check if the date string matches MM-YYYY format
  const monthYearPattern = /^(0[1-9]|1[0-2])-(\d{4})$/;
  const match = dateString.trim().match(monthYearPattern);

  if (match) {
    // If it matches MM-YYYY format, prepend '01-' to make it DD-MM-YYYY
    return `01-${dateString}`;
  }

  // Return the original string if it doesn't match the pattern
  return dateString;
}

export function formatDateSafely(
  dateString: string | null | undefined,
  format: string = 'MMM yyyy',
  fallback: string = 'Invalid Date'
): string {
  // Normalize the date string first
  const normalizedDateString = normalizeMonthYearDate(dateString);

  if (!isValidDate(normalizedDateString)) {
    return fallback;
  }

  try {
    const date = new Date(normalizedDateString!);
    // Simple date formatting - you can use a library like date-fns for more complex formatting
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch (error) {
    return fallback;
  }
}

export function updateQueryParamWithoutNavigation(
  paramKey: string,
  paramValue: string,
  route: ActivatedRoute,
  location: Location
) {
  const currentParams = { ...route.snapshot.queryParams };
  currentParams[paramKey] = paramValue;

  const queryString = new URLSearchParams(currentParams).toString();
  const newUrl = location.path().split('?')[0] + '?' + queryString;

  location.replaceState(newUrl); // Updates URL without navigation
}
export function calculateGrowthPercentage(
  newThisMonth: number,
  total: number
): number {
  // Real calculation: new items this month / previous total * 100
  const previousTotal = total - newThisMonth;
  if (previousTotal <= 0) {
    return newThisMonth > 0 ? 100 : 0; // If no previous data, show 100% if there are new items
  }
  return Math.round((newThisMonth / previousTotal) * 100);
}

export function detectContentType(file: File): ContentType {
  const extension = file.name.split('.').pop()?.toUpperCase();

  if (!extension) return ContentType.OTHER;

  const knownExtensions = Object.values(ContentType);

  return knownExtensions.includes(extension as ContentType)
    ? (extension as ContentType)
    : ContentType.OTHER;
}
/**
 * Convert a DB timestamp string (UTC but missing 'Z') into a proper UTC Date.
 */
function parseUtc(value: string | Date): Date {
  if (value instanceof Date) return value;
  if (!value) return new Date(NaN);

  // normalize (replace space with T, trim microseconds > 3 digits)
  const normalized = value.replace(' ', 'T').replace(/(\.\d{3})\d+$/, '$1');

  // already has timezone info (Z or ±HH:MM)? use native parser
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(normalized);
  if (hasTimezone) {
    return new Date(normalized);
  }

  // split date/time manually → treat as UTC
  const [datePart, timePart = '00:00:00'] = normalized.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  const [hour = '0', minute = '0', secondWithMs = '0'] = timePart.split(':');
  const [second, ms = '0'] = secondWithMs.split('.');

  return new Date(
    Date.UTC(
      year,
      month - 1, // JS months are 0-based
      day,
      Number(hour),
      Number(minute),
      Number(second),
      Number(ms)
    )
  );
}

/**
 * Format a DB UTC timestamp into a relative "time ago" string.
 */
export function timeAgo(dateString: string, locale: string = 'fr'): string {
  const date = parseUtc(dateString);

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale === 'fr' ? fr : undefined,
  });
}

function toUtcDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  if (!value) return new Date(NaN);

  // normalize space separator
  const normalized = value.replace(' ', 'T');

  // if no timezone info, force UTC by appending Z
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(normalized);
  return new Date(hasTimezone ? normalized : normalized + 'Z');
}
export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;

  if (start && end && new Date(end) < new Date(start)) {
    return { dateRangeInvalid: true };
  }

  return null;
};

export const getInterviewStatusStyle = (
  status: InterviewStatus
): StatusStyle => {
  const styles: Record<InterviewStatus, StatusStyle> = {
    SCHEDULED: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    IN_PROGRESS: {
      background: 'bg-blue-100',
      text: 'text-blue-800',
    },
    COMPLETED: {
      background: 'bg-green-100',
      text: 'text-green-800',
    },
    CANCELLED: {
      background: 'bg-red-100',
      text: 'text-red-800',
    },
    RESCHEDULED: {
      background: 'bg-purple-100',
      text: 'text-purple-800',
    },
    NO_SHOW: {
      background: 'bg-gray-100',
      text: 'text-gray-800',
    },
  };

  return styles[status];
};

export const getContractTypeClasses = (type: ContractType): string => {
  const style = getContractTypeStyle(type);
  return `px-2 py-2 text-[10px] font-semibold rounded-md ${style.background} ${style.text}`;
};

export const getContractTypeStyle = (type: ContractType): StatusStyle => {
  const styles: Record<ContractType, StatusStyle> = {
    CDD: {
      background: 'bg-indigo-100 dark:bg-indigo-950',
      text: 'text-indigo-700 dark:text-indigo-200',
    },
    CDI: {
      background: 'bg-yellow-100 dark:bg-yellow-950',
      text: 'text-yellow-700 dark:text-yellow-200',
    },
    INTERNSHIP: {
      background: 'bg-fuchsia-100 dark:bg-fuchsia-950',
      text: 'text-fuchsia-700 dark:text-fuchsia-200',
    },
    FREELANCE_CONTRACT: {
      background: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-700 dark:text-cyan-200',
    },
    TEMPORARY_CONTRACT: {
      background: 'bg-rose-100 dark:bg-rose-950',
      text: 'text-rose-700 dark:text-rose-200',
    },
  };

  return styles[type];
};
export const getInterviewStatusClasses = (status: InterviewStatus): string => {
  const style = getInterviewStatusStyle(status);
  return `px-2 py-1 text-[10px] font-semibold rounded-md ${style.background} ${style.text}`;
};

export const getApplicationStatusStyle = (
  status: ApplicationStatus
): StatusStyle => {
  const styles: Record<ApplicationStatus, StatusStyle> = {
    NEW: {
      background: 'bg-sky-100 dark:bg-sky-950',
      text: 'text-sky-700 dark:text-sky-200',
    },
    WITHDRAWN_BY_CANDIDATE: {
      background: 'bg-slate-100 dark:bg-slate-950',
      text: 'text-slate-700 dark:text-slate-200',
    },
    ACCEPTED_BY_VALIDATOR: {
      background: 'bg-emerald-100 dark:bg-emerald-950',
      text: 'text-emerald-700 dark:text-emerald-200',
    },
    REJECTED_BY_VALIDATOR: {
      background: 'bg-rose-100 dark:bg-rose-950',
      text: 'text-rose-700 dark:text-rose-200',
    },
    PUSHED_TO_VALIDATOR: {
      background: 'bg-amber-100 dark:bg-amber-950',
      text: 'text-amber-700 dark:text-amber-200',
    },
    CANCELLED_BY_RECRUITER: {
      background: 'bg-violet-100 dark:bg-violet-950',
      text: 'text-violet-700 dark:text-violet-200',
    },
    CANCELLED_BY_HR: {
      background: 'bg-orange-100 dark:bg-orange-950',
      text: 'text-orange-700 dark:text-orange-200',
    },
    INVALIDATED_BY_HR: {
      background: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-700 dark:text-cyan-200',
    },
    REJECTED_BY_HR: {
      background: 'bg-red-100 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-200',
    },
    SUBMITTED_TO_HR: {
      background: 'bg-blue-100 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-200',
    },
  };

  return styles[status];
};

export const getOfferStatusColor = (status: string): string => {
  switch (status) {
    case 'OPEN':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'HOLD':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'CLOSE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};
export const getApplicationStatusClasses = (
  status: ApplicationStatus
): string => {
  const style = getApplicationStatusStyle(status);
  return `px-2 py-1 text-[10px] font-semibold rounded-md ${style.background} ${style.text}`;
};
const defaultStyle: StatusStyle = {
  background: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-700 dark:text-gray-200',
};
export const getEmploymentTypeStyle = (type: EmploymentType): StatusStyle => {
  const styles: Record<EmploymentType, StatusStyle> = {
    FULL_TIME: {
      background: 'bg-blue-100 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-200',
    },
    FREELANCE: {
      background: 'bg-fuchsia-100 dark:bg-fuchsia-950',
      text: 'text-fuchsia-700 dark:text-fuchsia-200',
    },
    PART_TIME: {
      background: 'bg-indigo-100 dark:bg-indigo-950',
      text: 'text-indigo-700 dark:text-indigo-200',
    },
    INTERNSHIP: {
      background: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-700 dark:text-cyan-200',
    },
    TEMPORARY: {
      background: 'bg-orange-100 dark:bg-orange-950',
      text: 'text-orange-700 dark:text-orange-200',
    },
  };

  return styles[type] || defaultStyle;
};

export const getEmploymentTypeClasses = (type: EmploymentType): string => {
  const style = getEmploymentTypeStyle(type);
  return `px-4 py-1.5 text-xs font-medium rounded-md ${style.background} ${style.text}`;
};

export const getWorkModeStyle = (mode: WorkMode): StatusStyle => {
  const styles: Record<WorkMode, StatusStyle> = {
    ONSITE: {
      background: 'bg-slate-100 dark:bg-slate-950',
      text: 'text-slate-700 dark:text-slate-200',
    },
    REMOTE: {
      background: 'bg-teal-100 dark:bg-teal-950',
      text: 'text-teal-700 dark:text-teal-200',
    },
    HYBRID: {
      background: 'bg-violet-100 dark:bg-violet-950',
      text: 'text-violet-700 dark:text-violet-200',
    },
  };

  return styles[mode];
};

export const getWorkModeClasses = (mode: WorkMode): string => {
  const style = getWorkModeStyle(mode);
  return `px-4 py-1.5 text-xs font-medium rounded-md ${style.background} ${style.text}`;
};

export const getCandidateCreationSourceStyle = (
  source: CandidateCreationSource
): StatusStyle => {
  const styles: Record<CandidateCreationSource, StatusStyle> = {
    MANUAL: {
      background: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-800 dark:text-amber-200',
    },
    AI_GENERATED: {
      background: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-800 dark:text-orange-200',
    },
    EXTERNAL_SYNC: {
      background: 'bg-cyan-100 dark:bg-cyan-900',
      text: 'text-cyan-800 dark:text-cyan-200',
    },
  };
  return styles[source];
};

export const getCandidateCreationSourceClasses = (
  source: CandidateCreationSource
): string => {
  const style = getCandidateCreationSourceStyle(source);
  return `px-2 py-1 text-[10px] font-semibold rounded-md truncate max-w-[120px] ${style.background} ${style.text}`;
};

export const getCandidateValidationStatusStyle = (
  status: CandidateValidationStatus
): StatusStyle => {
  const styles: Record<CandidateValidationStatus, StatusStyle> = {
    INVALIDATED: {
      background: 'bg-red-200 dark:bg-red-900',
      text: 'text-red-900 dark:text-red-200',
    },
    VERIFIED: {
      background: 'bg-sky-100 dark:bg-sky-900',
      text: 'text-sky-800 dark:text-sky-200',
    },
  };
  return styles[status];
};

export const getCandidateValidationStatusClasses = (
  status: CandidateValidationStatus
): string => {
  const style = getCandidateValidationStatusStyle(status);
  return `px-2 py-1 text-[10px] font-semibold rounded-md truncate max-w-[120px] ${style.background} ${style.text}`;
};

export const getCandidateAvailabilityStatusStyle = (
  status: CandidateAvailabilityStatus
): StatusStyle => {
  const styles: Record<CandidateAvailabilityStatus, StatusStyle> = {
    REACHABLE: {
      background: 'bg-emerald-100 dark:bg-emerald-900',
      text: 'text-emerald-800 dark:text-emerald-200',
    },
    UNREACHABLE: {
      background: 'bg-slate-200 dark:bg-slate-800',
      text: 'text-slate-900 dark:text-slate-200',
    },
  };
  return styles[status];
};

export const getCandidateAvailabilityStatusClasses = (
  status: CandidateAvailabilityStatus
): string => {
  const style = getCandidateAvailabilityStatusStyle(status);
  return `px-2 py-1 text-[10px] font-semibold rounded-md truncate max-w-[120px] ${style.background} ${style.text}`;
};
