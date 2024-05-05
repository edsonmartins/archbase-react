import { MultiSelect, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

function translateCronToPortuguese(cron) {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    let description = "Executar: ";

    description += cron.month === '*' ? "Todos os meses" : `Nos meses de ${cron.month.split(',').map(m => isNaN(m) ? m : months[m - 1]).join(', ')}`;
    description += cron.dayOfMonth === '*' ? ", em todos os dias" : `, nos dias ${cron.dayOfMonth}`;
    description += cron.dayOfWeek === '*' ? "" : `, e nas ${cron.dayOfWeek.split(',').map(d => isNaN(d) ? d : daysOfWeek[parseInt(d, 10)]).join(', ')}`;
    description += cron.hours === '*' ? ", a qualquer hora" : `, às ${cron.hours.split(',').map(h => `${h}h`).join(', ')}`;
    description += cron.minutes === '*' ? ", e a qualquer minuto" : `, e nos minutos ${cron.minutes}`;

    return description;
}

export type ArchbaseCronExpressionEditorProps = {
    onChange: (value: any) => void
    readOnly?: boolean
    initialValue: any
    label?: any
    error?: string
  }

export function ArchbaseCronExpressionEditor({ label, initialValue, onChange, readOnly = false, error }: ArchbaseCronExpressionEditorProps) {
    const [cron, setCron] = useState({
        minutes: '*',
        hours: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
    });

    useEffect(() => {
        const parts = initialValue ? initialValue.split(' ') : ['*', '*', '*', '*', '*'];
        setCron({
            minutes: parts[0],
            hours: parts[1],
            dayOfMonth: parts[2],
            month: parts[3],
            dayOfWeek: parts[4]
        });
    }, [initialValue]);

    const updateCronPart = (part, values) => {
        const updatedCron = { ...cron, [part]: values.length > 0 ? values.join(',') : '*' };
        setCron(updatedCron);
        const value = `${updatedCron.minutes} ${updatedCron.hours} ${updatedCron.dayOfMonth} ${updatedCron.month} ${updatedCron.dayOfWeek}`
        if (!readOnly){
            onChange(value);
        }
    };

    const cronOptions = {
        minutes: Array.from({ length: 60 }, (_, i) => ({ value: `${i}`, label: `${i} minuto(s)` })),
        hours: Array.from({ length: 24 }, (_, i) => ({ value: `${i}`, label: `${i} hora(s)` })),
        dayOfMonth: Array.from({ length: 31 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1} dia(s)` })),
        month: [
            { value: '1', label: 'Janeiro' },
            { value: '2', label: 'Fevereiro' },
            { value: '3', label: 'Março' },
            { value: '4', label: 'Abril' },
            { value: '5', label: 'Maio' },
            { value: '6', label: 'Junho' },
            { value: '7', label: 'Julho' },
            { value: '8', label: 'Agosto' },
            { value: '9', label: 'Setembro' },
            { value: '10', label: 'Outubro' },
            { value: '11', label: 'Novembro' },
            { value: '12', label: 'Dezembro' }
        ],
        dayOfWeek: [
            { value: '0', label: 'Domingo' },
            { value: '1', label: 'Segunda' },
            { value: '2', label: 'Terça' },
            { value: '3', label: 'Quarta' },
            { value: '4', label: 'Quinta' },
            { value: '5', label: 'Sexta' },
            { value: '6', label: 'Sábado' }
        ]
    };

    return (
        <div>
            {label && <div><strong>{label}</strong></div>}
            {Object.keys(cronOptions).map((part) => (
                <MultiSelect
                    key={part}
                    data={cronOptions[part]}
                    label={{
                        minutes: 'Minutos',
                        hours: 'Horas',
                        dayOfMonth: 'Dia do Mês',
                        month: 'Mês',
                        dayOfWeek: 'Dia da Semana'
                    }[part]}
                    placeholder="Selecione os valores"
                    value={cron[part].split(',').filter((v) => v !== '*')}
                    onChange={(values) => updateCronPart(part, values)}
                    searchable
                    clearable
                    disabled={readOnly}
                    error={error && part === 'minutes' ? error : undefined} 
                />
            ))}
            <Stack gap={"xs"}>
                <strong>Expressão Cron:</strong> 
                <Text c="blue">{`${cron.minutes} ${cron.hours} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`}</Text>
                <strong>Descrição:</strong> 
                <Text c="blue">{translateCronToPortuguese(cron)}</Text>
            </Stack>
        </div>
    );
}
