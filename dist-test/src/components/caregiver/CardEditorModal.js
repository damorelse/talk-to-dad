import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { formatWithMiddleDot } from '../../services/syllables/syllableSplitter.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useDatabase } from '../../hooks/useDatabase.js';
import { Sparkles, X, Check, Star } from 'lucide-react';
export const CardEditorModal = ({ initialCard, categories, onSave, onCancel, }) => {
    const [label, setLabel] = useState(initialCard?.label || '');
    const [labelZh, setLabelZh] = useState(initialCard?.labelZh || '');
    const [spokenText, setSpokenText] = useState(initialCard?.spokenText || '');
    const [spokenTextZh, setSpokenTextZh] = useState(initialCard?.spokenTextZh || '');
    const [clue, setClue] = useState(initialCard?.clue || '');
    const [clueZh, setClueZh] = useState(initialCard?.clueZh || '');
    const [categoryId, setCategoryId] = useState(initialCard?.categoryId || categories[0]?.id || 'cat-needs');
    const [fitzgeraldCategory, setFitzgeraldCategory] = useState(initialCard?.fitzgeraldCategory || 'nouns');
    const [icon, setIcon] = useState(initialCard?.icon || '💬');
    const [phoneticSyllables, setPhoneticSyllables] = useState(initialCard?.phoneticSyllables || '');
    const [isFavorite, setIsFavorite] = useState(initialCard?.isFavorite || false);
    const { saveCard } = useDatabase();
    const handleAutoSyllables = () => {
        if (label.trim()) {
            setPhoneticSyllables(formatWithMiddleDot(label.trim()));
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!label.trim())
            return;
        const cardToSave = {
            id: initialCard?.id || `card-${Date.now()}`,
            categoryId,
            label: label.trim(),
            labelZh: labelZh.trim() || undefined,
            spokenText: spokenText.trim() || label.trim(),
            spokenTextZh: spokenTextZh.trim() || undefined,
            phoneticSyllables: phoneticSyllables.trim() || formatWithMiddleDot(label.trim()),
            clue: clue.trim() || undefined,
            clueZh: clueZh.trim() || undefined,
            fitzgeraldCategory,
            icon: icon.trim() || '💬',
            audioBlobId: initialCard?.audioBlobId,
            order: initialCard?.order || Date.now(),
            isFavorite,
            createdAt: initialCard?.createdAt || Date.now(),
            updatedAt: Date.now(),
        };
        await saveCard(cardToSave);
        onSave(cardToSave);
    };
    const fitzgeraldRoles = [
        { role: 'people', label: 'People / Pronouns (Yellow)', color: 'bg-yellow-400 text-yellow-950' },
        { role: 'verbs', label: 'Verbs / Actions (Green)', color: 'bg-green-400 text-green-950' },
        { role: 'nouns', label: 'Nouns / Objects (Orange)', color: 'bg-orange-400 text-orange-950' },
        { role: 'adjectives', label: 'Adjectives / Feelings (Blue)', color: 'bg-blue-400 text-blue-950' },
        { role: 'social', label: 'Social / Courtesy (Pink)', color: 'bg-pink-400 text-pink-950' },
        { role: 'questions', label: 'Questions (Purple)', color: 'bg-purple-400 text-purple-950' },
        { role: 'places', label: 'Places (Rose)', color: 'bg-rose-400 text-rose-950' },
        { role: 'emergency', label: 'Emergency / Urgent (Red)', color: 'bg-red-600 text-white' },
    ];
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none", children: _jsxs("div", { className: "w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin", children: [_jsxs("div", { className: "flex items-center justify-between w-full border-b border-slate-800 pb-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-black text-white", children: initialCard ? 'Edit AAC Card' : 'Create New AAC Card' }), _jsx("p", { className: "text-xs text-slate-400", children: "Configure visual card, spoken text, and colors" })] }), _jsx("button", { type: "button", onClick: onCancel, className: "text-slate-400 hover:text-slate-200 p-1.5 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSave, className: "flex flex-col gap-3.5", children: [_jsxs("div", { className: "grid grid-cols-4 gap-3", children: [_jsxs("div", { className: "col-span-3 flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Card Label *" }), _jsx("input", { type: "text", required: true, value: label, onChange: (e) => setLabel(e.target.value), placeholder: "e.g. Water, Blanket, Napkin", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { className: "col-span-1 flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Emoji / Icon" }), _jsx("input", { type: "text", value: icon, onChange: (e) => setIcon(e.target.value), placeholder: "\uD83D\uDCA7", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Traditional Chinese Name (\u7E41\u9AD4\u4E2D\u6587)" }), _jsx("input", { type: "text", value: labelZh, onChange: (e) => setLabelZh(e.target.value), placeholder: "e.g. \u6C34, \u559D\u6C34, \u6BDB\u6BEF", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "English Speech Phrase" }), _jsx("input", { type: "text", value: spokenText, onChange: (e) => setSpokenText(e.target.value), placeholder: label ? `I would like ${label.toLowerCase()}, please.` : 'English sentence', className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Chinese Speech Phrase (\u7E41\u9AD4\u4E2D\u6587)" }), _jsx("input", { type: "text", value: spokenTextZh, onChange: (e) => setSpokenTextZh(e.target.value), placeholder: labelZh ? `我想${labelZh}。` : '中文完整語音句子', className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "English Clue / Hint" }), _jsx("input", { type: "text", value: clue, onChange: (e) => setClue(e.target.value), placeholder: "e.g. What do you drink when you are thirsty?", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Chinese Clue / Hint (\u7E41\u9AD4\u4E2D\u6587\u63D0\u793A)" }), _jsx("input", { type: "text", value: clueZh, onChange: (e) => setClueZh(e.target.value), placeholder: "e.g. \u53E3\u6E34\u6642\u60F3\u559D\u7684\u900F\u660E\u6DB2\u9AD4", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Category" }), _jsx("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none", children: categories.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id))) })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Card Color & Role" }), _jsx("div", { className: "grid grid-cols-2 gap-1.5", children: fitzgeraldRoles.map((item) => (_jsxs("button", { type: "button", onClick: () => setFitzgeraldCategory(item.role), className: `
                      px-2.5 py-1.5 rounded-xl text-xs font-bold text-left border-2 transition-all flex items-center justify-between
                      ${fitzgeraldCategory === item.role
                                            ? 'border-white shadow-md brightness-110 scale-[1.02]'
                                            : 'border-transparent opacity-75 hover:opacity-100'}
                      ${item.color}
                    `, children: [_jsx("span", { children: item.role.toUpperCase() }), fitzgeraldCategory === item.role && _jsx(Check, { className: "w-4 h-4 stroke-[3]" })] }, item.role))) })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-xs font-bold text-slate-300", children: "Phonetic Syllables (Middle Dot)" }), _jsxs("button", { type: "button", onClick: handleAutoSyllables, className: "text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Auto-Split" })] })] }), _jsx("input", { type: "text", value: phoneticSyllables, onChange: (e) => setPhoneticSyllables(e.target.value), placeholder: "Wa \u00B7 ter", className: "px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-300 block", children: "Favorite Card" }), _jsx("span", { className: "text-[11px] text-slate-500", children: "Show in quick access favorites" })] }), _jsxs("button", { type: "button", onClick: () => setIsFavorite((f) => !f), className: `
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors
                  ${isFavorite
                                        ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'}
                `, children: [_jsx(Star, { className: `w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}` }), _jsx("span", { children: isFavorite ? 'Favorited' : 'Favorite' })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800", children: [_jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold border border-slate-700", children: "Cancel" }), _jsx(DebouncedTouchable, { type: "submit", minTouchSize: "md", className: "px-6 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-black shadow-md shadow-blue-900/40", children: "Save Card" })] })] })] }) }));
};
