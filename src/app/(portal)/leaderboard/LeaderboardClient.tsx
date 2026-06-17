'use client';
import { useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRoleColor, getDomainColor, getStarColor, formatRole } from '@/lib/utils';
import { DOMAIN_SUBDOMAINS } from '@/types';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/leaderboard';

const podiumColors = ['text-yellow-400', 'text-slate-400', 'text-orange-500'];
const podiumBgs = ['bg-yellow-500/10 border-yellow-500/30', 'bg-slate-800 border-slate-700', 'bg-orange-500/10 border-orange-500/30'];
const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardClient({ initialLeaderboard }: { initialLeaderboard: LeaderboardEntry[] }) {
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [subdomainFilter, setSubdomainFilter] = useState('ALL');

  const subdomains = domainFilter !== 'ALL'
    ? DOMAIN_SUBDOMAINS[domainFilter as keyof typeof DOMAIN_SUBDOMAINS] || []
    : [];

  // Filtering happens over the already-fetched full leaderboard — no network
  // round-trip per filter change.
  const leaderboard = useMemo(() => initialLeaderboard
    .filter(m => domainFilter === 'ALL' || m.domain === domainFilter)
    .filter(m => subdomainFilter === 'ALL' || m.subdomain === subdomainFilter)
    .slice(0, 50),
    [initialLeaderboard, domainFilter, subdomainFilter]
  );

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const rest = useMemo(() => leaderboard.slice(3), [leaderboard]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Leaderboard</h1>
        <p className="text-sm text-slate-400 mt-1">Member performance rankings based on task submissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={domainFilter} onValueChange={v => { setDomainFilter(v); setSubdomainFilter('ALL'); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Domain" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Domains</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Corporate">Corporate</SelectItem>
            <SelectItem value="Creatives">Creatives</SelectItem>
          </SelectContent>
        </Select>
        {subdomains.length > 0 && (
          <Select value={subdomainFilter} onValueChange={setSubdomainFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Subdomain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Subdomains</SelectItem>
              {subdomains.map((sd: string) => <SelectItem key={sd} value={sd}>{sd}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Trophy size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No data yet</p>
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {top3.map((member, idx) => (
                <Link href={`/members/${member.memberId}`} key={member.memberId}>
                  <Card className={`border ${podiumBgs[idx]} cursor-pointer text-center animate-fadeIn`} style={{ animationDelay: `${idx * 60}ms` }}>
                    <CardContent className="p-2 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{medals[idx]}</div>
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-1 sm:mb-2">
                        <AvatarFallback className="text-xs sm:font-bold">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-slate-100 text-xs sm:text-sm truncate">{member.name}</p>
                      <Badge className={`${getRoleColor(member.role)} mt-1 text-[10px] sm:text-xs`} variant="secondary">
                        <span className="hidden sm:inline">{formatRole(member.role, member.domain)}</span>
                        <span className="sm:hidden">{member.role.replace('_', ' ')}</span>
                      </Badge>
                      <div className={`text-base sm:text-2xl font-bold mt-1 sm:mt-2 ${podiumColors[idx]}`}>
                        {member.totalStars > 0 ? '+' : ''}{member.totalStars}⭐
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Rest of leaderboard */}
          {rest.length > 0 && (
            <>
              {/* Mobile: compact cards carrying role/domain/approved info the table hides below `sm` */}
              <div className="sm:hidden space-y-2">
                {rest.map((member, idx) => (
                  <Link
                    key={member.memberId}
                    href={`/members/${member.memberId}`}
                    className="block rounded-xl border border-slate-800 bg-slate-900 p-3 animate-fadeIn active:bg-slate-800/60"
                    style={{ animationDelay: `${Math.min(idx, 10) * 30}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 font-mono w-5 flex-shrink-0">{idx + 4}</span>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-100 truncate flex-1 min-w-0">{member.name}</span>
                      <span className={`text-sm font-bold flex-shrink-0 ${getStarColor(member.totalStars)}`}>
                        {member.totalStars > 0 ? '+' : ''}{member.totalStars}⭐
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 ml-8">
                      <Badge className={getRoleColor(member.role)} variant="secondary">{formatRole(member.role, member.domain)}</Badge>
                      {member.domain && member.role !== 'DIRECTOR' && <Badge className={getDomainColor(member.domain)} variant="secondary">{member.domain}</Badge>}
                      <span className="text-xs text-green-400 font-medium ml-auto flex-shrink-0">{member.approvedCount} approved</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* sm and up: full table */}
              <Card className="hidden sm:block">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[440px]">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="table-header text-left w-12">#</th>
                      <th className="table-header text-left">Member</th>
                      <th className="table-header text-left hidden md:table-cell">Role</th>
                      <th className="table-header text-left hidden lg:table-cell">Domain</th>
                      <th className="table-header text-right">Stars</th>
                      <th className="table-header text-right hidden sm:table-cell">Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((member, idx) => (
                      <tr key={member.memberId} className="table-row animate-fadeIn-row" style={{ animationDelay: `${Math.min(idx, 10) * 30}ms` }}>
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono">{idx + 4}</td>
                        <td className="px-4 py-3">
                          <Link href={`/members/${member.memberId}`} className="flex items-center gap-2 hover:text-orange-500">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-100">{member.name}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge className={getRoleColor(member.role)} variant="secondary">
                            {formatRole(member.role, member.domain)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {member.domain && member.role !== 'DIRECTOR' && <Badge className={getDomainColor(member.domain)} variant="secondary">{member.domain}</Badge>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-bold ${getStarColor(member.totalStars)}`}>
                            {member.totalStars > 0 ? '+' : ''}{member.totalStars}⭐
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell text-sm text-green-400 font-medium">{member.approvedCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
