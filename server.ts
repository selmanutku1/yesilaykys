/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// We import the initial data for DB seeding if it doesn't exist
import { 
  INITIAL_CAMP_CENTERS, 
  INITIAL_BUNGALOWS, 
  INITIAL_STAFF, 
  INITIAL_GROUPS, 
  INITIAL_CAMP_PERIODS, 
  INITIAL_PARTICIPANTS, 
  INITIAL_HEALTH_INCIDENTS, 
  INITIAL_MEAL_PLANS, 
  INITIAL_ACTIVITIES, 
  INITIAL_LOGS, 
  INITIAL_SURVEYS 
} from './src/data';

const DB_FILE = path.join(process.cwd(), 'db_store.json');

function getInitialState() {
  return {
    campCenters: INITIAL_CAMP_CENTERS,
    bungalows: INITIAL_BUNGALOWS,
    staff: INITIAL_STAFF,
    groups: INITIAL_GROUPS,
    periods: INITIAL_CAMP_PERIODS,
    participants: INITIAL_PARTICIPANTS,
    healthIncidents: INITIAL_HEALTH_INCIDENTS,
    mealPlans: INITIAL_MEAL_PLANS,
    activities: INITIAL_ACTIVITIES,
    surveys: INITIAL_SURVEYS,
    logs: INITIAL_LOGS
  };
}

function readState() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed.bungalows) {
        parsed.bungalows = parsed.bungalows.map((b: any) => ({ ...b, capacity: 6 }));
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error reading db_store.json, resetting to initial', error);
  }
  
  const initial = getInitialState();
  writeState(initial);
  return initial;
}

function writeState(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing db_store.json', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API endpoints
  app.get('/api/state', (req, res) => {
    const state = readState();
    res.json(state);
  });

  app.post('/api/state/sync', (req, res) => {
    try {
      const partialState = req.body;
      if (partialState && typeof partialState === 'object') {
        const currentState = readState();
        const newState = { ...currentState, ...partialState };
        writeState(newState);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Geçersiz veri formatı' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/apply', (req, res) => {
    try {
      const { type, payload } = req.body; // type can be 'individual' or 'convoy'
      const state = readState();
      const timestamp = new Date().toISOString();
      
      if (type === 'individual') {
        const p = payload;
        const newId = `P-REM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newParticipant = {
          ...p,
          id: newId,
          status: 'Başvuru Yapıldı',
          bungalowId: null,
          bedNumber: null,
          groupId: null,
          checkedIn: false
        };
        
        state.participants.push(newParticipant);
        
        // Add System Log
        state.logs.unshift({
          id: `L-${Date.now()}`,
          timestamp,
          user: 'Uzaktan Portal',
          action: 'Online Bireysel Başvuru',
          details: `${p.name} (${p.gender} - ${p.category}) adlı gönüllü uzaktan başvuru bağlantısıyla online müracaatta bulundu. İl: ${p.city}, İlçe: ${p.district}.`
        });
        
        writeState(state);
        return res.json({ success: true, participantId: newId });
      } else if (type === 'convoy') {
        const { convoyName, leader, members, campPeriodId } = payload;
        const baseIdNum = Date.now();
        const leaderId = `PT-REM-LDR-${baseIdNum}`;
        
        // 1. Leader Participant
        const newLeader = {
          ...leader,
          id: leaderId,
          status: 'Başvuru Yapıldı',
          bungalowId: null,
          bedNumber: null,
          campPeriodId,
          convoyName,
          isConvoyLeader: true,
          groupId: null,
          checkedIn: false
        };
        
        state.participants.push(newLeader);
        
        // 2. Members
        const newMembers = members.map((member: any, idx: number) => {
          return {
            ...member,
            id: `PT-REM-MEM-${baseIdNum}-${idx}`,
            status: 'Başvuru Yapıldı',
            bungalowId: null,
            bedNumber: null,
            phone: leader.phone,
            email: leader.email,
            address: leader.address || convoyName,
            city: leader.city,
            district: leader.district,
            campPeriodId,
            convoyName,
            isConvoyLeader: false,
            convoyLeaderId: leaderId,
            groupId: null,
            checkedIn: false
          };
        });
        
        state.participants.push(...newMembers);
        
        // Add System Log
        state.logs.unshift({
          id: `L-${Date.now()}`,
          timestamp,
          user: 'Uzaktan Portal',
          action: 'Online Kafile Başvurusu',
          details: `'${convoyName}' kafilesi (${leader.name} liderliğinde, ${members.length} katılımcı) uzaktan başvuru bağlantısıyla toplu müracaatta bulundu.`
        });
        
        writeState(state);
        return res.json({ success: true, leaderId });
      }
      
      res.status(400).json({ error: 'Geçersiz başvuru tipi' });
    } catch (err: any) {
      console.error('Application registration error', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
