import React from "react";
import "../styles/headers.css";
import styles from "./privacy-policy.module.scss";

/**
 * Component that displays the privacy policy to the user.
 */
export function PrivacyPolicy() {
  return (
    <div className={styles.background}>
      <div className={styles.centreBox}>
        <h1 className="header1">Privacy Policy</h1>
        <p>
          This privacy policy notice is for this website
          (https://yourpocketbook.uk), is served by Tony Richards, and governs
          the privacy of those who use it. The purpose of this policy is to
          explain to you how we control, process, handle and protect your
          personal information while browsing or using this website, including
          your rights under current laws and regulations. If you do not agree to
          the following policy you may wish to cease using this website.
        </p>
        <p>Policy key definitions:</p>
        <ul>
          <li>"I", "our", "us", or "we" refers to Tony Richards.</li>
          <li>"you", "the user" refer to the person(s) using this website.</li>
          <li>GDPR means General Data Protection Act.</li>
          <li>
            PECR means Privacy &amp; Electronic Communications Regulation.
          </li>
          <li>ICO means Information Commissioner's Office.</li>
          <li>
            Cookies mean small files stored on a users computer or device.
          </li>
        </ul>
        <h2>Processing of your personal data</h2>
        <p>
          We are exempt from registration in the ICO Data Protection Register
          because your personal data is only used for core business purposes.
        </p>
        <p>
          Under the GDPR (General Data Protection Regulation) we control and /
          or process any personal information about you electronically using the
          following lawful basis:
        </p>
        <p>
          <b>Lawful Basis:</b> Consent
        </p>
        <p>
          <b>The reason we use this basis:</b> You agree to this policy prior to
          using this website, and have the option to limit the usage to that
          only required to use the website. You are able to revoke this consent
          at any time, or delete your account if requested.
        </p>
        <p>
          <b>We process your information in the following ways:</b>
        </p>
        <ul>
          <li>
            Store your name and email address to allow us to identify you as an
            SJA volunteer, allowing us to restrict access to this site to SJA
            volunteers only.
          </li>
          <li>
            Optionally use your name and email address to allow us to notify you
            when the site is updated.
          </li>
        </ul>
        <p>
          <b>Data retention period:</b> We will continue to process your
          information under this basis until you withdraw consent or it is
          determined that your consent no longer exists.
        </p>
        <p>
          <b>Sharing your information:</b>
          We do not share your information with third parties.
        </p>
        <p>
          If, as determined by us, the lawful basis upon which we process your
          personal information changes, we will notify you about the change and
          any new lawful basis to be used if required. We shall stop processing
          your personal information if the lawful basis used is no longer
          relevant.
        </p>
        <h2>Your individual rights</h2>
        <p>Under the GDPR, your rights are as follows:</p>
        <ul>
          <li>The right to be informed.</li>
          <li>The right of access.</li>
          <li>The right to rectification.</li>
          <li>The right to erasure.</li>
          <li>The right to restrict processing.</li>
          <li>The right to data portability.</li>
          <li>The right to object.</li>
          <li>
            The right not to be subject to automated decision-making including
            profiling.
          </li>
        </ul>
        <p>
          You can read more about{" "}
          <a href="https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/individual-rights/">
            your rights in detail here
          </a>
          .
        </p>
        <p>
          You also have the right to complain to the{" "}
          <a href="https://ico.org.uk">ICO</a> if you feel there is a problem
          with the way we are handling your data.
        </p>
        <p>We handle subject access requests in accordance with the GDPR.</p>
        <h2>Internet cookies</h2>
        <p>
          We use cookies on this website to provide you with a better user
          experience. We do this by placing a small text file on your device /
          computer hard drive to track how you use the website, to record or log
          whether you have seen particular messages that we display, to keep you
          logged into the website where applicable, to display relevant adverts
          or content, referred you to a third party website.
        </p>
        <p>
          Some cookies are required to enjoy and use the full functionality of
          this website.
        </p>
        <p>
          We use a cookie control system which allows you to accept the use of
          cookies, and control which cookies are saved to your device /
          computer. Some cookies will be saved for specific time periods, where
          others may last indefinitely. Your web browser should provide you with
          the controls to manage and delete cookies from your device, please see
          your web browser options.
        </p>
        <p>Cookies that we use are:</p>
        <ul>
          <li>
            A user account identifier, which allows the system to remember you
            when you come back.
          </li>
          <li>
            An anonymous identifier used by Application Insights for usage
            tracking that helps us improve this website.
          </li>
        </ul>
        <h2>Data security and protection</h2>
        <p>
          We ensure the security of any personal information we hold by using
          secure data storage technologies and precise procedures in how we
          store, access and manage that information. Our methods meet the GDPR
          compliance requirement.
        </p>
        <h2>Transparent Privacy Explanations</h2>
        <p>
          We have provided some further explanations about user privacy and the
          way we use this website to help promote a transparent and honest user
          privacy methodology.
        </p>
        <h2>Email messages &amp; subscription</h2>
        <p>
          Under the GDPR, we use the consent lawful basis for anyone subscribing
          to our update emails. We only collect certain data about you, as
          detailed in the "Processing of your personal data" section above.
        </p>
        <p>
          We will not send marketing emails to you, but we might want to send
          you ones containing updates about the site. If you do not wish to see
          these update emails, you can unsubscribe by altering you account
          settings on this website, or clicking the unsubscribe link at the
          bottom of every email.
        </p>
      </div>
    </div>
  );
}
