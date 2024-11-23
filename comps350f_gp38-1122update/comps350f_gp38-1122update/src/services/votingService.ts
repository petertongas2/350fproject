import { db } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  writeBatch,
  serverTimestamp, 
  arrayUnion,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import type { VotingOption, Candidate, BallotRecord } from '../types';

const VOTING_OPTIONS_COLLECTION = 'votingOptions';
const BALLOTS_COLLECTION = 'ballots';
const USERS_COLLECTION = 'users';

export const VotingService = {
  async getAllVotingOptions(): Promise<VotingOption[]> {
    const snapshot = await getDocs(collection(db, VOTING_OPTIONS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VotingOption[];
  },

  async addVotingOption(option: Omit<VotingOption, 'id'>): Promise<VotingOption> {
    const optionRef = doc(collection(db, VOTING_OPTIONS_COLLECTION));
    const newOption = {
      ...option,
      id: optionRef.id,
      createdAt: serverTimestamp()
    };
    await setDoc(optionRef, newOption);
    return newOption as VotingOption;
  },

  async updateVotingOption(option: VotingOption): Promise<void> {
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, option.id);
    await updateDoc(optionRef, {
      ...option,
      updatedAt: serverTimestamp()
    });
  },

  async removeVotingOption(optionId: string): Promise<void> {
    await deleteDoc(doc(db, VOTING_OPTIONS_COLLECTION, optionId));
  },

  async addCandidate(optionId: string, candidate: Omit<Candidate, 'id'>): Promise<void> {
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, optionId);
    const newCandidate = {
      ...candidate,
      id: crypto.randomUUID(),
      votes: 0,
      createdAt: serverTimestamp()
    };
    
    await updateDoc(optionRef, {
      candidates: arrayUnion(newCandidate)
    });
  },

  async updateCandidate(optionId: string, candidate: Candidate): Promise<void> {
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, optionId);
    const option = (await getDoc(optionRef)).data() as VotingOption;
    
    const updatedCandidates = option.candidates.map(c => 
      c.id === candidate.id ? { ...candidate, updatedAt: serverTimestamp() } : c
    );

    await updateDoc(optionRef, { candidates: updatedCandidates });
  },

  async removeCandidate(optionId: string, candidateId: string): Promise<void> {
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, optionId);
    const option = (await getDoc(optionRef)).data() as VotingOption;
    
    await updateDoc(optionRef, {
      candidates: option.candidates.filter(c => c.id !== candidateId)
    });
  },

  async recordVote(ballot: Omit<BallotRecord, 'timestamp' | 'verified'>): Promise<void> {
    const batch = writeBatch(db);
    
    // Add ballot record with a unique ID
    const ballotRef = doc(collection(db, BALLOTS_COLLECTION));
    const newBallot = {
      ...ballot,
      id: ballotRef.id,
      timestamp: serverTimestamp(),
      verified: false,
      ipAddress: window.location.hostname,
      deviceInfo: navigator.userAgent
    };
    batch.set(ballotRef, newBallot);

    // Update candidate votes
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, ballot.optionId);
    const option = (await getDoc(optionRef)).data() as VotingOption;
    const updatedCandidates = option.candidates.map(c =>
      c.id === ballot.candidateId ? { ...c, votes: c.votes + 1 } : c
    );
    batch.update(optionRef, { candidates: updatedCandidates });

    // Update user's votedOptions
    const userRef = doc(db, USERS_COLLECTION, ballot.userId);
    batch.update(userRef, {
      votedOptions: arrayUnion(ballot.optionId)
    });

    await batch.commit();
  },

  async getAllBallots(): Promise<BallotRecord[]> {
    const ballotsQuery = query(
      collection(db, BALLOTS_COLLECTION),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(ballotsQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp: (data.timestamp as Timestamp).toDate(),
      } as BallotRecord;
    });
  },

  async verifyBallot(ballotId: string, verifiedBy: string): Promise<void> {
    const ballotRef = doc(db, BALLOTS_COLLECTION, ballotId);
    await updateDoc(ballotRef, {
      verified: true,
      verifiedAt: serverTimestamp(),
      verifiedBy
    });
  },

  async resetVotingTopic(optionId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Reset candidates' votes for the specific topic
    const optionRef = doc(db, VOTING_OPTIONS_COLLECTION, optionId);
    const option = (await getDoc(optionRef)).data() as VotingOption;
    const resetCandidates = option.candidates.map(c => ({ ...c, votes: 0 }));
    batch.update(optionRef, { candidates: resetCandidates });

    // Delete ballots for this topic
    const ballotsSnapshot = await getDocs(
      query(collection(db, BALLOTS_COLLECTION), where("optionId", "==", optionId))
    );
    ballotsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Reset votedOptions for users who voted in this topic
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.votedOptions && userData.votedOptions.includes(optionId)) {
        const updatedVotedOptions = userData.votedOptions.filter((id: string) => id !== optionId);
        batch.update(doc.ref, { votedOptions: updatedVotedOptions });
      }
    });

    await batch.commit();
  },

  async resetAllVotes(): Promise<void> {
    const batch = writeBatch(db);
    
    // Reset all candidate votes
    const optionsSnapshot = await getDocs(collection(db, VOTING_OPTIONS_COLLECTION));
    optionsSnapshot.docs.forEach(doc => {
      const option = doc.data() as VotingOption;
      const resetCandidates = option.candidates.map(c => ({ ...c, votes: 0 }));
      batch.update(doc.ref, { candidates: resetCandidates });
    });

    // Delete all ballots
    const ballotsSnapshot = await getDocs(collection(db, BALLOTS_COLLECTION));
    ballotsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Reset votedOptions for all users
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    usersSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { votedOptions: [] });
    });

    await batch.commit();
  }
};