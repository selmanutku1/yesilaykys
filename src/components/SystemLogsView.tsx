import React, { useState } from 'react';
import { Terminal, Clock, User, Filter, Download } from 'lucide-react';
import { SystemLog } from '../types';

interface SystemLogsViewProps {
  logs: SystemLog[];
}

export default function SystemLogsView({ logs }: SystemLogsViewProps) {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));
  const uniqueUsers = Array.from(new Set(logs.map(l => l.userName)));

  const filteredLogs = logs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterUser !== 'all' && log.userName !== filterUser) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Sistem Logları
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Sistemdeki tüm eylemlerin ve kullanıcı hareketlerinin kayıtları. Sadece Sistem Yöneticisi erişebilir.
          </p>
        </div>
        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer">
          <Download className="w-4 h-4" /> Dışa Aktar
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Tüm İşlemler</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Tüm Kullanıcılar</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Toplam {filteredLogs.length} kayıt
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-400">
                <th className="p-3 uppercase">Zaman</th>
                <th className="p-3 uppercase">Kullanıcı</th>
                <th className="p-3 uppercase">İşlem</th>
                <th className="p-3 uppercase">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs text-gray-800 dark:text-gray-200 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                  <td className="p-3 whitespace-nowrap text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold">
                    {log.userName} <span className="text-[10px] text-gray-400 font-normal">({log.userId})</span>
                  </td>
                  <td className="p-3">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">{log.details}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                    Seçili filtrelere uygun kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
