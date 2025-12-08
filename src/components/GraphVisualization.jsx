import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function GraphVisualization({ data, onNodeClick, clusterColors, clusterNames }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    d3.selectAll('.graph-tooltip').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add gradient background
    const defs = svg.append('defs');
    
    // Radial gradient for background
    const bgGradient = defs.append('radialGradient')
      .attr('id', 'bg-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '70%');
    
    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FDFCFA');
    
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#F0EBE3');

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bg-gradient)');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Handle positions - ensure valid numbers
    const getValidPosition = (val, fallback) => {
      if (val === null || val === undefined || isNaN(val)) return fallback;
      return val;
    };

    // Assign default positions if missing or invalid
    const processedNodes = data.nodes.map((node, i) => ({
      ...node,
      x: getValidPosition(node.x, 100 + (i % 4) * 180),
      y: getValidPosition(node.y, 100 + Math.floor(i / 4) * 180),
      cluster_id: node.cluster_id !== null && node.cluster_id !== undefined ? node.cluster_id : 0
    }));

    // Scale positions to fit the container
    const xValues = processedNodes.map(d => d.x);
    const yValues = processedNodes.map(d => d.y);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    
    const xScale = d3.scaleLinear()
      .domain([xMin - xRange * 0.1, xMax + xRange * 0.1])
      .range([100, width - 100]);
    
    const yScale = d3.scaleLinear()
      .domain([yMin - yRange * 0.1, yMax + yRange * 0.1])
      .range([100, height - 100]);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'linear-gradient(135deg, #3D3229 0%, #4A3D32 100%)')
      .style('color', '#F5F2ED')
      .style('padding', '12px 16px')
      .style('border-radius', '12px')
      .style('font-size', '13px')
      .style('font-family', "'DM Sans', sans-serif")
      .style('max-width', '280px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 10000)
      .style('box-shadow', '0 8px 32px rgba(0,0,0,0.25)')
      .style('border', '1px solid rgba(255,255,255,0.1)');

    // Draw edges with gradient
    if (data.edges && data.edges.length > 0) {
      data.edges.forEach((edge, i) => {
        const source = processedNodes.find(n => n.id === edge.source);
        const target = processedNodes.find(n => n.id === edge.target);
        
        if (source && target) {
          const gradientId = `edge-gradient-${i}`;
          const gradient = defs.append('linearGradient')
            .attr('id', gradientId)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', xScale(source.x))
            .attr('y1', yScale(source.y))
            .attr('x2', xScale(target.x))
            .attr('y2', yScale(target.y));
          
          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', clusterColors[source.cluster_id % clusterColors.length])
            .attr('stop-opacity', 0.6);
          
          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', clusterColors[target.cluster_id % clusterColors.length])
            .attr('stop-opacity', 0.6);

          g.append('line')
            .attr('x1', xScale(source.x))
            .attr('y1', yScale(source.y))
            .attr('x2', xScale(target.x))
            .attr('y2', yScale(target.y))
            .attr('stroke', `url(#${gradientId})`)
            .attr('stroke-width', Math.max(edge.similarity * 4, 1.5))
            .attr('stroke-linecap', 'round');
        }
      });
    }

    // Create node groups for glow effect
    const nodeGroups = g.append('g')
      .selectAll('g')
      .data(processedNodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer');

    // Add glow circles (larger, faded)
    nodeGroups.append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 28)
      .attr('fill', d => clusterColors[d.cluster_id % clusterColors.length])
      .attr('opacity', 0.15);

    // Add main circles
    nodeGroups.append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 18)
      .attr('fill', d => clusterColors[d.cluster_id % clusterColors.length])
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))');

    // Add inner highlight
    nodeGroups.append('circle')
      .attr('cx', d => xScale(d.x) - 4)
      .attr('cy', d => yScale(d.y) - 4)
      .attr('r', 6)
      .attr('fill', 'rgba(255,255,255,0.3)');

    // Event handlers
    nodeGroups
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).selectAll('circle')
          .transition()
          .duration(200)
          .attr('transform', `translate(0, -3)`);
        
        d3.select(this).select('circle:nth-child(2)')
          .transition()
          .duration(200)
          .attr('r', 22);
        
        const title = d.title || 'Untitled Paper';
        const shortTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
        const authors = d.authors ? d.authors.split(',')[0] + (d.authors.includes(',') ? ' et al.' : '') : '';
        const year = d.year || '';
        const clusterName = clusterNames?.[d.cluster_id] || `Cluster ${d.cluster_id + 1}`;
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; line-height: 1.4;">${shortTitle}</div>
            ${authors ? `<div style="color: #C4A77D; font-size: 12px; margin-bottom: 4px;">${authors}${year ? ` (${year})` : ''}</div>` : ''}
            <div style="display: inline-block; background: ${clusterColors[d.cluster_id % clusterColors.length]}; padding: 3px 8px; border-radius: 4px; font-size: 11px; margin-top: 4px;">
              ${clusterName.substring(0, 30)}${clusterName.length > 30 ? '...' : ''}
            </div>
          `)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 15) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).selectAll('circle')
          .transition()
          .duration(200)
          .attr('transform', 'translate(0, 0)');
        
        d3.select(this).select('circle:nth-child(2)')
          .transition()
          .duration(200)
          .attr('r', 18);
        
        tooltip.style('opacity', 0);
      });

    // Add node labels
    g.append('g')
      .selectAll('text')
      .data(processedNodes)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) + 38)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', "'DM Sans', sans-serif")
      .attr('font-weight', '500')
      .attr('fill', '#4A3D32')
      .text(d => {
        const title = d.title || 'Untitled';
        return title.length > 20 ? title.substring(0, 20) + '...' : title;
      });

    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll('.graph-tooltip').remove();
    };
  }, [data, onNodeClick, clusterColors, clusterNames]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%', borderRadius: '0 0 12px 12px' }}></svg>
    </div>
  );
}

export default GraphVisualization;
