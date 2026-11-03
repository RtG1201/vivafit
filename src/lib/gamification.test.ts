/// <reference types="jest" />
import { computeAchievements, currentStreak, longestStreak } from './gamification';
import { monthGrid, toISODate, weekDates } from './dates';

const day = (iso: string) => new Date(`${iso}T12:00:00`);

describe('currentStreak', () => {
  it('conta dias seguidos até hoje', () => {
    expect(currentStreak(['2026-10-28', '2026-10-29', '2026-10-30'], day('2026-10-30'))).toBe(3);
  });

  it('começa de ontem quando hoje ainda não tem registro', () => {
    expect(currentStreak(['2026-10-28', '2026-10-29'], day('2026-10-30'))).toBe(2);
  });

  it('zera quando ontem e hoje não têm registro', () => {
    expect(currentStreak(['2026-10-27'], day('2026-10-30'))).toBe(0);
  });

  it('ignora datas repetidas', () => {
    expect(currentStreak(['2026-10-30', '2026-10-30'], day('2026-10-30'))).toBe(1);
  });
});

describe('longestStreak', () => {
  it('encontra a maior sequência, mesmo fora de ordem', () => {
    expect(longestStreak(['2026-10-05', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-06'])).toBe(3);
  });

  it('atravessa a virada de mês', () => {
    expect(longestStreak(['2026-09-30', '2026-10-01'])).toBe(2);
  });

  it('retorna 0 sem registros', () => {
    expect(longestStreak([])).toBe(0);
  });
});

describe('computeAchievements', () => {
  it('libera conquistas pelos limites e calcula progresso', () => {
    const list = computeAchievements({
      workouts: 5,
      totalMinutes: 60,
      longestStreak: 3,
      habitDaysCompleted: 0,
      mealsPlanned: 0,
      goalsDone: 0,
    });
    const byId = Object.fromEntries(list.map((a) => [a.id, a]));
    expect(byId.first.unlocked).toBe(true);
    expect(byId.ten.unlocked).toBe(false);
    expect(byId.ten.progress).toBeCloseTo(0.5);
    expect(byId.hour.unlocked).toBe(true);
    expect(byId.streak3.unlocked).toBe(true);
    expect(byId.streak7.unlocked).toBe(false);
  });
});

describe('datas', () => {
  it('semana começa na segunda-feira', () => {
    const week = weekDates(day('2026-10-30'));
    expect(week[0]).toBe('2026-10-26');
    expect(week[6]).toBe('2026-11-01');
  });

  it('grade de outubro/2026 começa numa quinta', () => {
    const grid = monthGrid(2026, 9);
    expect(grid.slice(0, 4)).toEqual([null, null, null, '2026-10-01']);
    expect(grid.length % 7).toBe(0);
    expect(grid.filter(Boolean)).toHaveLength(31);
  });

  it('formata data local', () => {
    expect(toISODate(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
});
