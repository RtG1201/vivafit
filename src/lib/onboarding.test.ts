import { EMPTY_ANSWERS, fitsEquipment, isBeginner, joinPt, planSummary } from './onboarding';

describe('joinPt', () => {
  it('junta listas em português', () => {
    expect(joinPt([])).toBe('');
    expect(joinPt(['a'])).toBe('a');
    expect(joinPt(['a', 'b'])).toBe('a e b');
    expect(joinPt(['a', 'b', 'c'])).toBe('a, b e c');
  });
});

describe('isBeginner', () => {
  it('trata sem resposta e níveis baixos como iniciante', () => {
    expect(isBeginner(null)).toBe(true);
    expect(isBeginner('comecando')).toBe(true);
    expect(isBeginner('ativa')).toBe(false);
  });
});

describe('fitsEquipment', () => {
  it('aceita exercícios sem equipamento para todas', () => {
    expect(fitsEquipment({ equipment: 'nenhum' }, [])).toBe(true);
    expect(fitsEquipment({ equipment: '' }, [])).toBe(true);
  });

  it('exige o equipamento que a usuária tem', () => {
    expect(fitsEquipment({ equipment: 'halteres' }, ['nenhum'])).toBe(false);
    expect(fitsEquipment({ equipment: 'Halteres' }, ['halteres'])).toBe(true);
  });
});

describe('planSummary', () => {
  it('resume respostas vazias sem quebrar', () => {
    expect(planSummary(EMPTY_ANSWERS)).toEqual([
      'Treinos curtos, nível iniciante',
      'Sem precisar de equipamento',
      'Todas as receitas, sem restrição',
    ]);
  });

  it('cada resposta muda uma linha do plano', () => {
    const lines = planSummary({
      goals: ['energia'],
      activity_level: 'ativa',
      minutes_available: 20,
      equipment: ['colchonete', 'elastico'],
      diet_prefs: ['sem_lactose'],
    });
    expect(lines).toEqual([
      'Treinos de até 20 min, nível intermediário',
      'Com colchonete e elástico',
      'Receitas já filtradas: sem lactose',
      'Foco em: ter mais energia',
    ]);
  });
});
