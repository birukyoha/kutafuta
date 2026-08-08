// File: /src/utils/generatePortfolioPDF.ts
// Utility to generate a clean, styled PDF summary for Talent Portfolios using jsPDF

import { jsPDF } from 'jspdf';

export interface TalentPortfolioPDFData {
  id: string;
  full_name: string;
  tagline?: string;
  category?: string;
  union_status?: string;
  location?: string;
  day_rate?: number | string;
  hourly_rate?: number | string;
  years_experience?: number | string;
  rating?: number | string;
  review_count?: number | string;
  bio?: string;
  equipment_list?: string;
  website_url?: string;
  vimeo_url?: string;
  imdb_url?: string;
  instagram_handle?: string;
  profile_type?: string;
  stage_name?: string;
  city_country?: string;
  languages_spoken?: string;
  primary_department?: string;
  specific_roles?: string;
  skills_proficiency?: string;
  equipment_owned?: string;
  previous_productions?: string;
  certifications_licenses?: string;
  representation_status?: string;
  acting_experience?: string;
  special_skills?: string;
  height?: string;
  clothing_size?: string;
  shoe_size?: string;
  hair_color?: string;
  eye_color?: string;
  distinctive_features?: string;
  email?: string;
  phone_number?: string;
}

export interface PortfolioMediaItem {
  id?: string;
  title: string;
  description?: string;
  media_type?: string;
  file_url?: string;
}

export function generatePortfolioPDF(
  talent: TalentPortfolioPDFData,
  portfolioList: PortfolioMediaItem[] = []
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  let cursorY = margin;

  // Color Palette Definitions
  const darkBg = [17, 17, 20]; // #111114
  const accentRed = [255, 62, 0]; // #ff3e00
  const lightBg = [248, 247, 244]; // #f8f7f4
  const darkText = [15, 23, 42]; // #0f172a
  const mutedText = [100, 116, 139]; // #64748b
  const cardBg = [241, 245, 249]; // #f1f5f9
  const borderCol = [226, 232, 240]; // #e2e8f0

  // Helper to check for page overflow
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      cursorY = margin;
      drawHeaderBanner(true); // Redraw subtle header on new pages
    }
  };

  // Header Banner Function
  const drawHeaderBanner = (isSubsequentPage = false) => {
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(margin, cursorY, contentWidth, isSubsequentPage ? 14 : 26, 'F');

    // Accent left stripe
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(margin, cursorY, 3, isSubsequentPage ? 14 : 26, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(isSubsequentPage ? 10 : 13);
    doc.text('KUTAFUTATALENT // CINEMATIC TALENT NETWORK', margin + 8, cursorY + (isSubsequentPage ? 9 : 11));

    if (!isSubsequentPage) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text('VERIFIED CREW & CAST PORTFOLIO SUMMARY', margin + 8, cursorY + 18);

      doc.setFontSize(7);
      doc.text(`DATE: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - margin - 8, cursorY + 18, { align: 'right' });
    }

    cursorY += (isSubsequentPage ? 18 : 32);
  };

  // Render Page 1 Header
  drawHeaderBanner(false);

  // ---------------------------------------------------------------------------
  // 1. TALENT PROFILE HERO SUMMARY CARD
  // ---------------------------------------------------------------------------
  const heroCardHeight = 42;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.rect(margin, cursorY, contentWidth, heroCardHeight, 'FD');

  // Name & Category
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  const fullNameStr = (talent.full_name || 'Talent Profile').toUpperCase();
  doc.text(fullNameStr, margin + 6, cursorY + 10);

  // Category Tag
  const categoryStr = (talent.category || 'Film Professional').replace(/_/g, ' ').toUpperCase();
  doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
  doc.setFontSize(7);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.rect(margin + 6, cursorY + 14, 45, 6, 'F');
  doc.text(categoryStr, margin + 8, cursorY + 18);

  // Union & Location Pills
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  const unionStr = (talent.union_status || 'NON-UNION').replace(/_/g, ' ').toUpperCase();
  doc.rect(margin + 54, cursorY + 14, 30, 6, 'F');
  doc.text(unionStr, margin + 56, cursorY + 18);

  // Tagline
  if (talent.tagline) {
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(9);
    const splitTagline = doc.splitTextToSize(talent.tagline, contentWidth - 12);
    doc.text(splitTagline[0], margin + 6, cursorY + 26);
  }

  // Key Metadata Row
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);

  const locationText = `Location: ${talent.location || 'Los Angeles, CA'}`;
  const expText = `Experience: ${talent.years_experience || '8'}+ Years`;
  const rateText = `Day Rate: $${talent.day_rate || '1,200'} / day`;

  doc.text(`${locationText}  |  ${expText}  |  ${rateText}`, margin + 6, cursorY + 36);

  cursorY += heroCardHeight + 8;

  // ---------------------------------------------------------------------------
  // 2. CONTACT & LINKS BAR
  // ---------------------------------------------------------------------------
  const links: string[] = [];
  if (talent.email) links.push(`Email: ${talent.email}`);
  if (talent.phone_number) links.push(`Phone: ${talent.phone_number}`);
  if (talent.website_url) links.push(`Web: ${talent.website_url}`);
  if (talent.vimeo_url) links.push(`Vimeo: ${talent.vimeo_url}`);
  if (talent.imdb_url) links.push(`IMDb: ${talent.imdb_url}`);

  if (links.length > 0) {
    checkPageBreak(18);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.rect(margin, cursorY, contentWidth, 14, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.text('VERIFIED CHANNELS:', margin + 6, cursorY + 9);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const linksJoined = links.join('   •   ');
    const truncatedLinks = doc.splitTextToSize(linksJoined, contentWidth - 42)[0] || linksJoined;
    doc.text(truncatedLinks, margin + 38, cursorY + 9);

    cursorY += 18;
  }

  // Helper Section Heading
  const drawSectionHeading = (title: string) => {
    checkPageBreak(14);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.text(`[ ${title.toUpperCase()} ]`, margin, cursorY);

    doc.setDrawColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY + 2, pageWidth - margin, cursorY + 2);

    cursorY += 8;
  };

  // ---------------------------------------------------------------------------
  // 3. EXECUTIVE BIOGRAPHY
  // ---------------------------------------------------------------------------
  if (talent.bio) {
    drawSectionHeading('Executive Biography');

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);

    const bioLines = doc.splitTextToSize(talent.bio, contentWidth);
    const bioHeight = bioLines.length * 4.5;

    checkPageBreak(bioHeight);
    doc.text(bioLines, margin, cursorY);
    cursorY += bioHeight + 6;
  }

  // ---------------------------------------------------------------------------
  // 4. SPECS & PHYSICAL ATTRIBUTES (Cast / Crew)
  // ---------------------------------------------------------------------------
  const hasCastStats = talent.height || talent.clothing_size || talent.shoe_size || talent.hair_color || talent.eye_color || talent.special_skills;
  const hasCrewSpecs = talent.certifications_licenses || talent.previous_productions || talent.skills_proficiency;

  if (hasCastStats || hasCrewSpecs) {
    drawSectionHeading(hasCastStats ? 'Performer Attributes & Physical Specs' : 'Certifications & Production History');

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);

    if (hasCastStats) {
      const statsList: string[] = [];
      if (talent.height) statsList.push(`Height: ${talent.height}`);
      if (talent.clothing_size) statsList.push(`Clothing: ${talent.clothing_size}`);
      if (talent.shoe_size) statsList.push(`Shoe: ${talent.shoe_size}`);
      if (talent.hair_color) statsList.push(`Hair: ${talent.hair_color}`);
      if (talent.eye_color) statsList.push(`Eyes: ${talent.eye_color}`);
      if (talent.representation_status) statsList.push(`Agency: ${talent.representation_status}`);

      if (statsList.length > 0) {
        checkPageBreak(12);
        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
        doc.rect(margin, cursorY, contentWidth, 10, 'F');
        doc.text(statsList.join('   |   '), margin + 4, cursorY + 6.5);
        cursorY += 14;
      }

      if (talent.special_skills) {
        checkPageBreak(10);
        doc.setFont('Helvetica', 'bold');
        doc.text('Special Skills: ', margin, cursorY);
        doc.setFont('Helvetica', 'normal');
        doc.text(talent.special_skills, margin + 25, cursorY);
        cursorY += 8;
      }
    }

    if (talent.certifications_licenses) {
      checkPageBreak(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Certifications & Licenses: ', margin, cursorY);
      doc.setFont('Helvetica', 'normal');
      doc.text(talent.certifications_licenses, margin + 42, cursorY);
      cursorY += 8;
    }

    if (talent.previous_productions) {
      checkPageBreak(12);
      doc.setFont('Helvetica', 'bold');
      doc.text('Key Productions: ', margin, cursorY);
      doc.setFont('Helvetica', 'normal');
      const prodLines = doc.splitTextToSize(talent.previous_productions, contentWidth - 32);
      doc.text(prodLines, margin + 32, cursorY);
      cursorY += prodLines.length * 4.5 + 4;
    }
  }

  // ---------------------------------------------------------------------------
  // 5. OWNED GEAR & EQUIPMENT PACKAGE
  // ---------------------------------------------------------------------------
  if (talent.equipment_list || talent.equipment_owned) {
    drawSectionHeading('Owned Camera / Equipment Package');

    const gearText = talent.equipment_list || talent.equipment_owned || 'Standard commercial gear package available.';
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);

    const gearLines = doc.splitTextToSize(gearText, contentWidth - 8);
    const gearBoxHeight = gearLines.length * 4.5 + 8;

    checkPageBreak(gearBoxHeight);
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.rect(margin, cursorY, contentWidth, gearBoxHeight, 'FD');

    doc.text(gearLines, margin + 4, cursorY + 6);
    cursorY += gearBoxHeight + 8;
  }

  // ---------------------------------------------------------------------------
  // 6. MEDIA PORTFOLIO & PAST PROJECTS
  // ---------------------------------------------------------------------------
  if (portfolioList && portfolioList.length > 0) {
    drawSectionHeading(`Past Projects & Showreel Archive (${portfolioList.length})`);

    portfolioList.slice(0, 6).forEach((item, index) => {
      checkPageBreak(18);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
      doc.rect(margin, cursorY, contentWidth, 15, 'FD');

      // Media Type Badge
      doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
      doc.rect(margin + 3, cursorY + 3.5, 22, 5, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text((item.media_type || 'project').toUpperCase(), margin + 5, cursorY + 7);

      // Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.text(item.title, margin + 28, cursorY + 7);

      // Description
      if (item.description) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
        const shortDesc = doc.splitTextToSize(item.description, contentWidth - 32)[0] || item.description;
        doc.text(shortDesc, margin + 28, cursorY + 12);
      }

      cursorY += 18;
    });
  }

  // ---------------------------------------------------------------------------
  // 7. FOOTER ON ALL PAGES
  // ---------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text('KUTAFUTATALENT — CONFIDENTIAL & VERIFIED FILM CREW PORTFOLIO', margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Save the generated PDF file
  const fileName = `${talent.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_portfolio.pdf`;
  doc.save(fileName);
}
