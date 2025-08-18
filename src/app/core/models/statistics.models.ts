export interface DashboardStatistics {
  companiesStatistics: CompaniesStatistics;
  jobOfferStatistics: JobOfferStatistics;
  candidatesStatistics: CandidatesStatistics;
  jobOfferApplicationStatistics: JobOfferApplicationStatistics;
  interviewStatistics: InterviewStatistics;
}
export interface JobOfferStatistics {
  totalJobOffers: number | null;
  totalActiveJobOffers: number | null;
  totalInactiveJobOffers: number | null;
  averageApplicationsPerOffer: number | null;
  newJobOffersThisMonth: number | null;
  newJobOffersThisWeek: number | null;
}
export interface CandidatesStatistics {
  totalCandidates: number | null;
  totalProfiles: number | null;
  newCandidatesThisMonth: number | null;
  newCandidatesThisWeek: number | null;
}

export interface CompaniesStatistics {
  totalCompanies: number | null;
  newCompaniesThisMonth: number | null;
  newCompaniesThisWeek: number | null;
}
export interface InterviewStatistics {
  totalInterviews: number | null;
  newInterviewsThisMonth: number | null;
  newInterviewsThisWeek: number | null;
  upcomingInterviews: number | null;
}
export interface JobOfferApplicationStatistics {
  totalApplications: number | null;
  totalAcceptedApplications: number | null;
  totalRejectedApplications: number | null;
  newApplicationsThisMonth: number | null;
  newApplicationsThisWeek: number | null;
}
export interface RecruiterDashboardStatisticsResponse {
  candidatesStats: CandidatesStatistics;
  applicationsStats: JobOfferApplicationStatistics;
  interviewsStats: InterviewStatistics;
  activeOffersCount: number;
}
export interface ValidatorDashboardStatisticsResponse {
  assignedApplicationsStats: JobOfferApplicationStatistics;
  assignedOffersCount: number;
}

export interface OfferViewRequest {
  offerId: string;
}
export interface OfferViewResponse {
  offerId: string;
  viewedAt: string;
}
