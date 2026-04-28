// SupabaseClient.js — Full in-memory mock replacing Supabase
// Supports .from().select().eq().neq().gt().gte().lt().lte().in().or().ilike()
// .is().not().order().range().limit().single().maybeSingle().insert().update().delete()

import { ALL_TABLES } from "./dummyData";

// Deep clone to avoid mutation
const db = JSON.parse(JSON.stringify(ALL_TABLES));

// Helper: get next ID for a table
const getNextId = (table) => {
  const arr = db[table] || [];
  const maxId = arr.reduce((max, r) => Math.max(max, r.id || r.task_id || 0), 0);
  return maxId + 1;
};

// Query builder class
class QueryBuilder {
  constructor(tableName, data) {
    this._table = tableName;
    this._data = [...(data || [])];
    this._filters = [];
    this._orderBy = null;
    this._rangeFrom = null;
    this._rangeTo = null;
    this._limitVal = null;
    this._selectCols = '*';
    this._countOnly = false;
    this._headOnly = false;
    this._op = 'select'; // select | insert | update | delete
    this._insertData = null;
    this._updateData = null;
  }

  select(cols, opts) {
    this._selectCols = cols || '*';
    if (opts?.count === 'exact') this._countOnly = true;
    if (opts?.head) this._headOnly = true;
    return this;
  }

  eq(col, val) { this._filters.push(r => String(r[col]) === String(val)); return this; }
  neq(col, val) { this._filters.push(r => String(r[col]) !== String(val)); return this; }
  gt(col, val) { this._filters.push(r => r[col] > val); return this; }
  gte(col, val) { this._filters.push(r => r[col] >= val); return this; }
  lt(col, val) { this._filters.push(r => r[col] < val); return this; }
  lte(col, val) { this._filters.push(r => r[col] <= val); return this; }
  
  in(col, vals) {
    this._filters.push(r => (vals || []).includes(r[col]));
    return this;
  }

  is(col, val) {
    this._filters.push(r => r[col] === val || r[col] === undefined);
    return this;
  }

  ilike(col, pattern) {
    const p = (pattern || '').replace(/%/g, '').toLowerCase();
    this._filters.push(r => (r[col] || '').toLowerCase().includes(p));
    return this;
  }

  not(col, op, val) {
    if (op === 'is' && val === null) {
      this._filters.push(r => r[col] !== null && r[col] !== undefined);
    } else if (op === 'eq') {
      this._filters.push(r => String(r[col]) !== String(val));
    } else if (op === 'ilike') {
      const p = (val || '').replace(/%/g, '').toLowerCase();
      this._filters.push(r => !(r[col] || '').toLowerCase().includes(p));
    }
    return this;
  }

  or(filterStr) {
    // Parse or patterns like "admin_done.is.null,admin_done.eq.false"
    // Also handles "submission_date.not.is.null" and "status.ilike.%done%"
    const parts = (filterStr || '').split(',');
    const fns = parts.map(part => {
      const segs = part.trim().split('.');
      if (segs.length < 3) return () => true;
      
      // Handle negation: col.not.op.val
      if (segs[1] === 'not') {
        const [col, , op, ...rest] = segs;
        const val = rest.join('.');
        if (op === 'is' && val === 'null') return r => r[col] !== null && r[col] !== undefined;
        if (op === 'eq') return r => String(r[col]) !== val;
        return () => true;
      }
      
      const [col, op, ...rest] = segs;
      const val = rest.join('.');
      if (op === 'eq') return r => String(r[col]) === val;
      if (op === 'is' && val === 'null') return r => r[col] === null || r[col] === undefined;
      if (op === 'ilike') {
        const p = val.replace(/%/g, '').toLowerCase();
        return r => (r[col] || '').toLowerCase().includes(p);
      }
      return () => true;
    });
    this._filters.push(r => fns.some(fn => fn(r)));
    return this;
  }

  order(col, opts) {
    this._orderBy = { col, ascending: opts?.ascending !== false };
    return this;
  }

  range(from, to) { this._rangeFrom = from; this._rangeTo = to; return this; }
  limit(n) { this._limitVal = n; return this; }

  insert(rows) {
    this._op = 'insert';
    this._insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(data) {
    this._op = 'update';
    this._updateData = data;
    return this;
  }

  delete() {
    this._op = 'delete';
    return this;
  }

  upsert(data, opts) {
    this._op = 'insert';
    this._insertData = Array.isArray(data) ? data : [data];
    return this;
  }

  // Execute and return result
  _execute() {
    const table = db[this._table] || [];

    if (this._op === 'insert') {
      const inserted = (this._insertData || []).map(row => {
        const nextId = getNextId(this._table);
        const newRow = { ...row, id: nextId, task_id: nextId };
        table.push(newRow);
        return newRow;
      });
      db[this._table] = table;
      return { data: inserted, error: null, count: inserted.length };
    }

    if (this._op === 'delete') {
      let filtered = [...table];
      this._filters.forEach(fn => { filtered = filtered.filter(fn); });
      const idsToRemove = new Set(filtered.map(r => r.id || r.task_id));
      db[this._table] = table.filter(r => !idsToRemove.has(r.id || r.task_id));
      return { data: filtered, error: null, count: filtered.length };
    }

    if (this._op === 'update') {
      let filtered = [...table];
      this._filters.forEach(fn => { filtered = filtered.filter(fn); });
      const updatedRows = [];
      filtered.forEach(match => {
        const idx = table.findIndex(r => (r.id || r.task_id) === (match.id || match.task_id));
        if (idx !== -1) {
          Object.assign(table[idx], this._updateData);
          updatedRows.push({ ...table[idx] });
        }
      });
      db[this._table] = table;
      return { data: updatedRows, error: null, count: updatedRows.length };
    }

    // SELECT
    let result = [...table];
    this._filters.forEach(fn => { result = result.filter(fn); });

    if (this._orderBy) {
      const { col, ascending } = this._orderBy;
      result.sort((a, b) => {
        const av = a[col] || '', bv = b[col] || '';
        return ascending ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }

    const count = result.length;

    if (this._rangeFrom !== null && this._rangeTo !== null) {
      result = result.slice(this._rangeFrom, this._rangeTo + 1);
    }
    if (this._limitVal !== null) {
      result = result.slice(0, this._limitVal);
    }

    // Filter columns if specific ones requested
    if (this._selectCols && this._selectCols !== '*') {
      const cols = this._selectCols.split(',').map(c => c.trim().split(' ')[0]);
      if (cols.length > 0 && cols[0] !== '*') {
        result = result.map(row => {
          const filtered = {};
          cols.forEach(c => { if (c in row) filtered[c] = row[c]; });
          return filtered;
        });
      }
    }

    if (this._headOnly) {
      return { data: null, error: null, count };
    }

    return { data: result, error: null, count };
  }

  // Terminal methods
  async then(resolve) { resolve(this._execute()); }

  single() {
    return Promise.resolve((() => {
      const res = this._execute();
      return { data: res.data?.[0] || null, error: res.data?.[0] ? null : { message: 'No rows found' }, count: res.count };
    })());
  }

  maybeSingle() {
    return Promise.resolve((() => {
      const res = this._execute();
      return { data: res.data?.[0] || null, error: null, count: res.count };
    })());
  }
}

// Main mock
const supabase = {
  from: (tableName) => new QueryBuilder(tableName, db[tableName] || []),

  rpc: async (fnName, params) => {
    if (fnName === 'secure_login') {
      const user = (db.users || []).find(
        u => u.user_name === params.input_username && u.password === params.input_password
      );
      if (user) {
        return { data: [user], error: null };
      }
      return { data: [], error: null };
    }
    return { data: [], error: null };
  },

  channel: () => {
    const ch = {
      on: () => ch,
      subscribe: () => ch,
      unsubscribe: () => {},
    };
    return ch;
  },

  removeChannel: () => {},

  storage: {
    from: () => ({
      upload: async () => ({ data: { path: 'mock/audio.webm' }, error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: `https://mock-storage.local/${path}` } }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: [], error: null }),
      download: async () => ({ data: null, error: null }),
    }),
  },
};

export default supabase;
