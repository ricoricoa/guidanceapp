import React, { useState } from 'react';
import { Award, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { InputField, TipsCard, FormModal, StatusBadge } from './StudentDashboardPartials';

/**
 * CharacterReferralTab Component
 * Allows students to request character/moral referrals
 */
export const CharacterReferralTab = () => {
  const [referrals, setReferrals] = useState([
    {
      id: 1,
      referrer: 'Ms. Sarah Johnson',
      subject: 'Academic Excellence',
      requestedDate: '2025-11-15',
      status: 'approved',
      purpose: 'College Application',
    },
    {
      id: 2,
      referrer: 'Mr. Michael Chen',
      subject: 'Community Service',
      requestedDate: '2025-11-18',
      status: 'pending',
      purpose: 'Scholarship Application',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    referrer: '',
    subject: '',
    purpose: '',
  });
  const [errors, setErrors] = useState({});

  const counselors = [
    { id: 1, name: 'Ms. Sarah Johnson' },
    { id: 2, name: 'Mr. Michael Chen' },
    { id: 3, name: 'Mrs. Emily Rodriguez' },
  ];

  const referralSubjects = [
    'Academic Excellence',
    'Character & Integrity',
    'Leadership Skills',
    'Community Service',
    'Problem Solving',
    'Teamwork',
    'Communication Skills',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.referrer || !formData.subject || !formData.purpose) {
      setErrors({
        referrer: !formData.referrer ? 'Please select a counselor' : '',
        subject: !formData.subject ? 'Please select a subject' : '',
        purpose: !formData.purpose ? 'Please enter the purpose' : '',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReferral = {
        id: referrals.length + 1,
        referrer: counselors.find(c => c.id == formData.referrer)?.name,
        subject: formData.subject,
        requestedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        purpose: formData.purpose,
      };

      setReferrals([...referrals, newReferral]);
      setMessage('Character referral request sent successfully!');
      setFormData({ referrer: '', subject: '', purpose: '' });
      setShowModal(false);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to create referral request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Character Referrals
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Request Referral
        </button>
      </div>

      {message && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="hover:opacity-75">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <TipsCard
        icon={Award}
        title="About Character Referrals"
        description="Request character and moral referrals from counselors for college applications, scholarships, or other purposes."
        tips={[
          'Be specific about the purpose of your referral',
          'Choose a counselor who knows your strengths well',
          'Allow at least 2 weeks for the counselor to prepare',
          'Referrals are typically needed for college or scholarship applications',
        ]}
        variant="info"
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Referral Requests</h3>

        {referrals.length > 0 ? (
          <div className="grid gap-4">
            {referrals.map(referral => (
              <div
                key={referral.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{referral.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">From: {referral.referrer}</p>
                  </div>
                  <StatusBadge status={referral.status} />
                </div>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <p>
                    <span className="font-semibold">Purpose:</span> {referral.purpose}
                  </p>
                  <p>
                    <span className="font-semibold">Requested:</span>{' '}
                    {new Date(referral.requestedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {referral.status === 'pending' && (
                    <>
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-700 dark:text-yellow-300">Pending review by counselor</span>
                    </>
                  )}
                  {referral.status === 'approved' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">Approved and ready to download</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No referral requests yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Click "Request Referral" to get started</p>
          </div>
        )}
      </div>

      <FormModal
        title="Request Character Referral"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setErrors({});
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Send Request"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Select Counselor <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.referrer}
            onChange={e => setFormData({ ...formData, referrer: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Choose a counselor --</option>
            {counselors.map(counselor => (
              <option key={counselor.id} value={counselor.id}>
                {counselor.name}
              </option>
            ))}
          </select>
          {errors.referrer && <p className="text-red-600 text-xs mt-1">{errors.referrer}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Referral Subject <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select subject --</option>
            {referralSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Purpose <span className="text-red-600">*</span>
          </label>
          <textarea
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="e.g., College Application, Scholarship Application, Job Application"
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          {errors.purpose && <p className="text-red-600 text-xs mt-1">{errors.purpose}</p>}
        </div>
      </FormModal>
    </div>
  );
};

export default CharacterReferralTab;
