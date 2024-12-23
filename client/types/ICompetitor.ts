export interface ICompetitor {
    name?: string; // Optional as it might be partially updated
    email?: string; // Email must follow the regex if provided
    phoneNumber?: string; // Phone number must follow the regex if provided
    country?: string; // Country code must have more than 2 characters if provided
}
  
export interface IDBCompetitor extends ICompetitor {
id: string; 
}  