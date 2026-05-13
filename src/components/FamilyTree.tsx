import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Person, Translation } from '../types';
import { useTranslation } from 'react-i18next';

interface FamilyTreeProps {
  person: Person;
  allPersons: Person[];
  onSelectPerson: (id: string) => void;
}

interface TreeNode {
  id: string;
  name: Translation;
  type: 'root' | 'father' | 'mother' | 'spouse' | 'child';
  children?: TreeNode[];
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({ person, allPersons, onSelectPerson }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof Translation;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data
    const findPerson = (id?: string) => allPersons.find(p => p.id === id);

    const root: TreeNode = {
      id: person.id,
      name: person.name,
      type: 'root',
      children: []
    };

    if (person.familyTree?.father) {
      const p = findPerson(person.familyTree.father);
      if (p) root.children?.push({ id: p.id, name: p.name, type: 'father' });
    }
    if (person.familyTree?.mother) {
      const p = findPerson(person.familyTree.mother);
      if (p) root.children?.push({ id: p.id, name: p.name, type: 'mother' });
    }
    person.familyTree?.spouses?.forEach(sId => {
      const p = findPerson(sId);
      if (p) root.children?.push({ id: p.id, name: p.name, type: 'spouse' });
    });
    person.familyTree?.children?.forEach(cId => {
      const p = findPerson(cId);
      if (p) root.children?.push({ id: p.id, name: p.name, type: 'child' });
    });

    if (!root.children || root.children.length === 0) {
        // Add a message or empty state if needed
    }

    const width = 600;
    const height = 300;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    const tree = d3.tree<TreeNode>().size([width - 100, height - 100]);
    const d3Root = d3.hierarchy(root);
    tree(d3Root);

    const g = svg.append('g')
      .attr('transform', 'translate(50, 50)');

    // Links
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#c5a059')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(d3Root.links())
      .join('path')
      .attr('d', d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(d3Root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onSelectPerson(d.data.id));

    node.append('circle')
      .attr('fill', d => d.data.type === 'root' ? '#c5a059' : '#1a1a1a')
      .attr('stroke', '#c5a059')
      .attr('stroke-width', 2)
      .attr('r', 5);

    const getRelationshipLabel = (type: string) => {
      return t(`relationship_${type}`) || type;
    };

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -8 : 8)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('fill', '#c1c1c1')
      .attr('class', 'font-sans font-bold uppercase tracking-widest text-[8px]')
      .text(d => `${d.data.name[lang]} - ${getRelationshipLabel(d.data.type)}`)
      .clone(true).lower()
      .attr('stroke', '#1a1a1a')
      .attr('stroke-width', 3);

  }, [person, allPersons, lang, onSelectPerson, t]);

  return (
    <div className="bg-background-dark/50 p-6 border border-egyptian-gold-dim rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-egyptian-gold">{t('family_tree_title')}</h4>
      </div>
      <svg ref={svgRef}></svg>
      <p className="text-[8px] text-egyptian-gold/40 mt-4 uppercase tracking-widest text-center italic">
        {t('select_relative')}
      </p>
    </div>
  );
};
