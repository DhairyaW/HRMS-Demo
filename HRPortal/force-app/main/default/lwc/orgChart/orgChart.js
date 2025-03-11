import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/D3';
import getHierarchyData from '@salesforce/apex/AccountHierarchyController.getHierarchyData';
 
export default class OrgChart extends LightningElement {
    hierarchyData;
    d3Initialized = false;
 
    @wire(getHierarchyData)
    wiredHierarchy({ error, data }) {
        if (data) {
            this.hierarchyData = data;
            console.log('hierarchyData...'+this.hierarchyData);
            
            this.initializeD3();
        } else if (error) {
            console.error('Error fetching hierarchy data:', error);
        }
    }
 
    initializeD3() {
        if (this.d3Initialized) return;
        this.d3Initialized = true;
 
        loadScript(this, D3)
            .then(() => this.renderHierarchy())
            .catch((error) => console.error('Error loading D3.js', error));
    }
 
    renderHierarchy() {
        if (!this.hierarchyData) return;
   
        const container = this.template.querySelector('.chart-container');
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style['background-color'] = 'White';
   
        const containerWidth = container.offsetwidth || 1200;
        const containerHeight = container.offsetHeight || 300;
           // Dynamic tree size calculation
        const nodeWidth = 380; // Minimum horizontal space between nodes
        const nodeHeight = 360; // Minimum vertical space between nodes
   
        const root = d3.hierarchy(this.hierarchyData, (d) => d.children);
        const totalDepth = root.height + 1;
        const totalNodes = root.descendants().length;
   
        const treeWidth = Math.max(containerWidth, totalNodes * nodeWidth);
        const treeHeight = Math.max(containerHeight, totalDepth * nodeHeight);
   
        const svg = d3.select(container)
            .append('svg')
            .attr('width', treeWidth + 450) // Add padding for zoom/pan
            .attr('height', treeHeight + 800) // Add padding for zoom/pan;
   
        const g = svg.append('g')
        .attr('transform', `translate(0, 100)`); // Add extra top margin (100px)
   
        const treeLayout = d3.tree()
            .size([treeWidth, treeHeight])
            .separation((a, b) => (a.parent === b.parent ? 2.5 : 3.5)); // Space between nodes
   
        treeLayout(root);
 
   
        // Render links
        g.selectAll('path.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', (d) => {
                const startX = d.source.x;
                const startY = d.source.y;
                const endX = d.target.x;
                const endY = d.target.y;
   
                return `M${startX},${startY}
                        V${(startY + endY) / 2}
                        H${endX}
                        V${endY}`;
            })
            .attr('stroke', '#ccc')
            .attr('stroke-width', 10)
            .attr('fill', 'none');
   
        // Render nodes
        const nodes = g.selectAll('g.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
   
        nodes.each(function (d) {
            const group = d3.select(this);
   
            const padding = 15;
            const photoSize = 120;
            const extraPadding = 10;
   
            const nameText = group.append('text')
                .attr('x', photoSize + padding * 2)
                .attr('y', -10)
                .style('font-size', '30px')
                .style('font-weight', 'bold')
                .style('fill', '#291528')
                .text(d.data.name);
   
            const roleText = group.append('text')
                .attr('x', photoSize + padding * 2)
                .attr('y', 13)
                .style('font-size', '20px')
                .style('font-weight', 'bold')
                .style('fill', '#575761')
                .text(d.data.role);
 
 
         /*       const extraInfoText = group.append('text')
        .attr('x', photoSize + padding * 2)
        .attr('y', 50)
        .style('font-size', '14px')
        .style('fill', '#A1C298')
        .text(d.data.extraInfo || 'Additional Info'); // Example of extra content*/
   
            const nameBBox = nameText.node().getBBox();
            const roleBBox = roleText.node().getBBox();
            // const extraInfoBBox = extraInfoText.node().getBBox();
           
            const cardWidth = Math.max(photoSize + padding * 3 + Math.max(nameBBox.width, roleBBox.width), 300);
            const cardHeight =
            padding + // Top padding (single)
            photoSize +   // Profile photo height
            nameBBox.height + // Name text height
            roleBBox.height + // Role text height
           
            extraPadding; // Add extra space ONLY at the bottom
 
            // Add a colored strip at the top of the card
            group.append('rect')
            .attr('x', -cardWidth / 2)
            .attr('y', -cardHeight / 2) // Position it at the top of the card
            .attr('width', cardWidth)
            .attr('height', 30) // Height of the color strip
            .attr('rx', 5)
            .attr('fill', '#2e538f'); // Color for the strip, you can change this color
       
 
            group.insert('rect', ':first-child')
                .attr('x', -cardWidth / 2)
                .attr('y', -cardHeight / 2  + extraPadding / 2)
                .attr('width', cardWidth)
                .attr('height', cardHeight)
                .attr('rx', 12)
                 .attr('fill', '#F0EFF4')
                .attr('stroke', 'a5a8a6')
                .attr('stroke-width', 5)
                .attr('class', 'node-card')
                .style('filter', 'drop-shadow(8px 8px 8px rgba(0,0,0,0.3))'); // Optional box-shadow
 
   
            group.append('foreignObject')
            .attr('x', -photoSize / 2)  // Center the image
            .attr('y', -cardHeight / 2 - photoSize / 3) // Move it slightly above the card
                .attr('width', photoSize)
                .attr('height', photoSize)
                .append('xhtml:div')
                .style('background', 'white')
                .style('width', `${photoSize}px`)
                .style('height', `${photoSize}px`)
                .style('border-radius', '30%')
                .style('overflow', 'hidden')
                .style('border', '3px solid white')  // Optional border for contrast
                .style('box-shadow', '0px 4px 6px rgba(0,0,0,0.3)') // Add shadow effect
                .style('border', '1px solid black')
                .html((d) => {
                    let profileImageHtml = d.data.profileImage || '';
                    const imgMatch = profileImageHtml.match(/<img\s+[^>]*src="([^"]+)"[^>]*>/);
                    const imageUrl = imgMatch && imgMatch[1] ? imgMatch[1] : 'https://via.placeholder.com/60';
                    return `<img src="${imageUrl}" alt="Photo" style="width: 100%; height: 100%;" />`;
                });
   
            // Adjust Name & Role Position Below Image
nameText.attr('x', -nameBBox.width / 2)
.attr('y', -cardHeight / 2 + photoSize / 2 + padding+30);
 
roleText.attr('x', -roleBBox.width / 2)
.attr('y', -cardHeight / 2 + photoSize / 2 + padding + nameBBox.height+20);

const borderAnimation = group.insert('rect', ':first-child')
            .attr('x', -cardWidth / 2)
            .attr('y', -cardHeight / 2 + extraPadding / 2)
            .attr('width', cardWidth)
            .attr('height', cardHeight)
            .attr('rx', 12)
            .attr('fill', 'none')
            .attr('stroke', '#3A3E3B') // Gold border color
            .attr('stroke-width', 6)
            .attr('stroke-dasharray', '0, 1000') // Initially hidden
            .attr('stroke-linecap', 'round');
       
 
           
            let selectedNode = null; // Store the currently selected node
           
 
              // Add click listener for the popup
          group.on('click', (event, d) => {


            borderAnimation
            .attr('stroke-dasharray', '400, 1000') // Total length of border
            .attr('stroke-dashoffset', '400') // Start from beginning
            .transition()
            .duration(500) // Speed of animation
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', '0') // Move along the border
            .on('end', () => {
                // Once the animation completes, show the popup
                showPopup(event, d);
            });

            console.log ('click on',d);
 
            // If the same node is clicked again, close the popup
    if (selectedNode === d) {
        d3.select(container).selectAll('.node-popup').remove();
        selectedNode = null; // Reset selection
        return;
    }
    selectedNode = d; // Update selected node
    // Remove any existing popup
    d3.select(container).selectAll('.node-popup').remove();
 
    // Extract profile image from the HTML string
    let profileImageHtml = d.data.profileImage || '';
    const imgMatch = profileImageHtml.match(/<img\s+[^>]*src="([^"]+)"[^>]*>/);
    const imageUrl = imgMatch && imgMatch[1] ? imgMatch[1] : 'https://via.placeholder.com/60'; // Default image
 
 
 
        // Tooltip div
        const popup = d3.select(container)
        .append('div')
        .attr('class', 'node-popup')
        .style('position', 'absolute')
        .style('background', 'linear-gradient(135deg,rgb(248, 233, 233),#F5EDF0)') // Gradient background
        .style('border', '1px solid #ddd')
        .style('border-radius', '6px')
        .style('box-shadow', '0 2px 6px rgba(0,0,0,0.2)')
        .style('padding', '10px')
        .style('min-width', '200px')
        .style('z-index', 1000)
        .style('pointer-events', 'auto')
        .style('opacity', '0') // Initially hidden for fade-in effect
        .style('transition', 'opacity 0.2s ease-in-out') // Smooth transition
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 150}px`);
 
 
            // Populate the popup with node details
            popup.html(`
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <!-- Profile Image Container (Same as in Nodes) -->
            <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                border: 2px solid white;
                display: flex;
                justify-content: center;
                align-items: center;">
               
                 <img src="${imageUrl}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
 
            <!-- Name & Role -->
            <div style="margin-left: 12px;">
                <div style="font-size: 18px; font-weight: bold; color: #333;">${d.data.name}</div>
                <div style="font-size: 14px; color: #555;">${d.data.role || 'N/A'}</div>
            </div>
        </div>
 
 
         <!-- Section Break -->
        <div style="height: 1px; background: #ddd; margin: 10px 0;"></div>
 
                   <!-- Dynamic Field Set -->
        <div>
            ${Object.entries(d.data.tooltipData || {}).map(([key, value], index) => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    border-radius: 6px;
                    margin-bottom: 4px;
                    background: ${index % 2 === 0 ? '#eceaf1' : '#dfdbe6'};
                    color: ${index % 2 === 0 ? '#424C55' : '#424C55'};
                    transition: transform 0.2s ease-in-out;
                " onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                    <strong>${key}:</strong> <span>${value || 'N/A'}</span>
                </div>
            `).join('')}
        </div>
 
        <div style="text-align: center; margin-top: 10px;">
           
        </div>
    `);
 
            // Apply fade-in effect
    setTimeout(() => popup.style('opacity', '1'), 10);
 
            // Close popup on button click
            popup.select('button').on('click', () => {
                popup.remove();
            });
 
            // Close popup on clicking outside
            d3.select('body').on('click.popup', (e) => {
                if (!popup.node().contains(e.target)) {
                    popup.remove();
                    d3.select('body').on('click.popup', null); // Remove the event listener
                }
            });
 
              // Prevent zoom/pan interference
              event.stopPropagation();
            });
        });
 
   
        // Zoom and pan setup
        const zoom = d3.zoom()
            .scaleExtent([0.1, .50])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
 
 
            // Define a gradient background for cards
const defs = svg.append('defs');
defs.append('linearGradient')
    .attr('id', 'cardGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%')
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#1f3e5a')
    .attr('stop-opacity', 1);
 
defs.select('#cardGradient')
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#4a90e2')
    .attr('stop-opacity', 1);
 
// Define a drop shadow filter
 
const filter = defs.append('filter')
    .attr('id', 'drop-shadow')
    .attr('x', '-20%')
    .attr('y', '-20%')
    .attr('width', '150%')
    .attr('height', '150%');
 
filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 4) // Adjust for more/less blur
    .attr('result', 'blur');
 
filter.append('feOffset')
    .attr('in', 'blur')
    .attr('dx', 4) // Horizontal offset
    .attr('dy', 4) // Vertical offset
    .attr('result', 'offsetBlur');
 
const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'offsetBlur');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
 
 
   
        const svgNode = svg.call(zoom);
   
        // Fit to viewport on load
        const initialScale = Math.min(containerWidth / treeWidth, containerHeight / treeHeight);
        const initialTransform = d3.zoomIdentity.translate(containerWidth / 50, 50).scale(initialScale);
        svgNode.call(zoom.transform, initialTransform);
    }
 
}